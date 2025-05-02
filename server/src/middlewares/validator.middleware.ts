import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./handleError.middleware";
const validQueries = [
  "reactionType",
  "questionType",
  "type",
  "userType",
  "post",
  "comment",
  "type",
  "page",
  "limit",
  "companyName",
  "tags",
  "name",
  "status",
  "position",
  "department",
  "role",
  "start",
  "end",
  "title",
  "type",
  "targetType",
  "salaryMin",
  "salaryMax",
  "location",
  "skills",

  "jobExperience",
  "applicantTypes",
  "jobType",
  "workplaceType",
  "jobTitle",
  "salary",
  "views",
  "createdAt",
  
  "resetByName",

  "currentAddress",

  "interviewResult",
  "interviewStatus",
  "interviewPlatform",
];

export const expressValidator = (validators: any[]) => {
  return asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      req.body = req.body.variables?.input || req.body.variables || req.body;
      for (const validator of validators) {
        await validator?.run(req);
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (!res.headersSent) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "Validation failed",
            errors: errors.array().map((err) => ({
              field: (err as any).path || "unknown",
              message: err.msg,
              type: err.type,
            })),
          });
        }
      }

      return next();
    }
  );
};

// Required params [param name => id]
export const requiredParamMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.id || !/^[a-fA-F0-9]{24}$/.test(req.params?.id)) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
    return next();
  };
};

// If no identifier is sent such as profile ID, take it from curUserId,
// In this case this is the current user's profile
export const validateToggleParamMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.id) {
      if (req.curUser?.userId) {
        req.body.id = { userId: req.curUser?.userId };
        return next();
      }
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    if (!/^[a-fA-F0-9]{24}$/.test(req.params?.id)) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
    req.body.id = { _id: req.params?.id };
    return next();
  };
};

// Used to specify the query you defined
// It is located in the array, and allows move to the next middleware.
export const validateQueryMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let queryKey in req?.query) {
      if (!validQueries.includes(queryKey)) {
        return res.status(404).json({
          success: false,
          message: "Not found",
        });
      }
    }
    return next();
  };
};

// If not send userId in body so take userId from curUserId
export const validateOptionalUserIdMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId ? req.body.userId : req.curUser?.userId;
    if (userId && !/^[a-zA-Z0-9]{28}$/.test(userId)) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
    req.curUser.userId = userId;
    return next();
  };
};

// Required userId
export const validateRequiredUserIdMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!/^[a-zA-Z0-9]{28}$/.test(req.body.userId)) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
    return next();
  };
};
