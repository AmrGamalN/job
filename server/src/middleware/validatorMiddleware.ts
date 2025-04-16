import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validIds = [
  "id",
  "userId",
  "addressId",
  "interestId",
  "companyId",
  "groupId",
  "influencerId",
  "hobbyId",
  "industryId",
  "educationId",
  "experienceId",
  "profileId",
  "projectId",
  "securityId",
];

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
    for (let paramKey in req?.params) {
      if (!validIds.includes(paramKey)) {
        return res.status(400).json({
          success: false,
          message: `Parameter "${paramKey}" is not allowed`,
        });
      }
    }
    return next();
  };
};

export const validateParamFirebaseMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let paramKey in req?.params) {
      if (!validIds.includes(paramKey) && paramKey !== "userId") {
        return res.status(400).json({
          success: false,
          message: `Parameter "${paramKey}" is not allowed`,
        });
      }
    }
    return next();
  };
};
