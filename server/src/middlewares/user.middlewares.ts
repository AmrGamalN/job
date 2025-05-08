import { Model } from "mongoose";
import graphqlFields from "graphql-fields";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.util";
import { asyncHandler } from "./handleError.middleware";
import Connection from "../models/mongodb/client/connection.model";
import User from "../models/mongodb/client/user.model";
import { GraphqlType } from "../types/middleware.type";

type Method = "findById" | "find" | "findOne";
type IdField = "params" | "body" | "query";
type IdKey = "id" | "userId";
const modelsAllowedForPending = ["user_connections"];

class UserMiddleware {
  private static Instance: UserMiddleware;

  public static getInstance() {
    if (!UserMiddleware.Instance) {
      UserMiddleware.Instance = new UserMiddleware();
    }
    return UserMiddleware.Instance;
  }

  public expressVisibilityMiddleware<T>(options: {
    model: Model<T>;
    method: Method;
    idField: IdField;
    idKey: IdKey;
  }) {
    return asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        return this.authorizeVisibilityAccess<T>(options, req, next);
      }
    );
  }

  public graphqlVisibilityMiddleware<T>(options: {
    model: Model<T>;
    method: Method;
    idField: IdField;
    idKey: IdKey;
  }) {
    return asyncHandler(async (gqlType: GraphqlType) => {
      const selectedFields = Object.keys(
        graphqlFields(gqlType.info).data || {}
      ).join(" ");

      return this.authorizeVisibilityAccess<T>(
        options,
        gqlType.context.req,
        gqlType.context.next,
        selectedFields
      );
    });
  }

  private async authorizeVisibilityAccess<T>(
    options: {
      model: Model<T>;
      method: Method;
      idField: IdField;
      idKey: IdKey;
    },
    req: Request,
    next: NextFunction,
    selectedFields?: any
  ) {
    const { model, method, idField, idKey } = options;
    const idValue = req[idField]?.[idKey];
    const viewerUserId = req?.curUser?.userId;
    let targetId: any;
    if (["findById", "find"].includes(method))
      targetId = idKey === "id" ? { _id: idValue } : { userId: idValue };
    else {
      targetId = idKey === "id" && {
        // Handle case profile: To get user by link
        profileLink: process.env.BACKEND_URL + req.originalUrl,
      };
    }

    const targetUserData = await this.initializeModel<T>(
      model,
      method,
      targetId,
      selectedFields
    );

    // Handle case admin: Can get all
    if (req.curUser?.role === "admin" || req.curUser?.role === "manager") {
      req.body.data = targetUserData;
      return next();
    }

    // Handle case following: If following, Can see each other
    if (
      (model.modelName == "user_follows" &&
        viewerUserId === targetUserData?.followerId) ||
      viewerUserId === targetUserData?.followingId
    ) {
      req.body.data = targetUserData;
      return next();
    }

    // Handle case visibility:[public,connections,private]
    return this.checkUserProfileVisibility(
      targetId,
      targetUserData,
      model,
      req,
      next
    );
  }

  // Build mongodb model
  private async initializeModel<T>(
    model: Model<T>,
    method: Method,
    targetId: any,
    selectedFields: any
  ) {
    let targetUserData: any;
    if (["findById", "find"].includes(method)) {
      targetUserData = await (model as any)
        [method](targetId)
        .select(selectedFields ?? {})
        .lean();
      if (!targetUserData)
        throw new CustomError(
          `${model.modelName} not found`,
          "NotFound",
          false,
          404
        );

      return targetUserData;
    }
  }

  // TargetId.id => If send params [id] to get address & Get target UserId & Use with findById
  // TargetId.userId => If send params [userid] to get all address of user & Use with find
  private async checkUserProfileVisibility(
    targetId: {
      _id?: string;
      userId?: string;
    },
    targetUserData: any,
    model: any,
    req: Request,
    next: NextFunction
  ) {
    const viewerUserId = req.curUser?.userId;
    const targetUserId =
      targetUserData?.userId ??
      targetId?.userId ??
      targetUserData?.recipientId ??
      targetUserData?.senderId;

    // Handle case: If viewer and target user are same
    if (viewerUserId == targetUserId) {
      req.body.data = targetUserData;
      return next();
    }
    console.log("ssssssssssssssssssssss");
    // Handle connection status
    const getVisibility = await User.findOne({
      userId: targetUserId,
    })
      .select("visibility")
      .lean();

    switch (getVisibility?.visibility) {
      case "public":
        req.body.data = targetUserData;
        return next();

      case "private":
        this.forbiddenError("Profile is private");

      case "connection":
        const isFriend = await Connection.findOne({
          $or: [
            { senderId: viewerUserId, recipientId: targetUserId },
            { senderId: targetUserId, recipientId: viewerUserId },
          ],
        });

        if (!isFriend)
          this.forbiddenError("Only friends can view this profile");
        if (isFriend?.blockStatus === "blocked")
          this.forbiddenError(" You are blocked by this user");
        if (isFriend?.status === "pending") {
          // Handle case connection: If pending, Can see each other
          if (!modelsAllowedForPending.includes(model.modelName)) {
            this.forbiddenError("You are not friends with this user");
          }
        }
        req.body.data = targetUserData;
        return next();
      default:
        this.forbiddenError("Invalid visibility");
    }
  }

  private forbiddenError(message: string) {
    throw new CustomError(`Access denied: ${message}`, "Forbidden", false, 403);
  }
}
export default UserMiddleware;
