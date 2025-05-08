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

  "blockStatus",
  "recipientName",

  "nameFollower",
  "nameFollowing",
  "followStatus",
  "FollowingType",

  "subject",
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

//  Validate params id & required
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

// Validate user id & required
export const requiredUserIdMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.userId || !/^[a-zA-Z0-9]{28}$/.test(req.params.userId)) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
    return next();
  };
};

// Validate queries
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
