import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { serviceResponse } from "../utils/responseHandler";

const validIds = ["id"];
const validQueries = ["reactionType", "post", "comment"];

export const expressValidator = (validators: any[]) => {
  return async (
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
  };
};

export const validateParamMiddleware = () => {
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

export const validateQueryFirebaseMiddleware = () => {
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
