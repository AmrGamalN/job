import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.util";
import { asyncHandler } from "./handleError.middleware";
import CompanySecurity from "../models/mongodb/company/security.model";

class CompanyMiddleware {
  private static Instance: CompanyMiddleware;

  public static getInstance() {
    if (!CompanyMiddleware.Instance) {
      CompanyMiddleware.Instance = new CompanyMiddleware();
    }
    return CompanyMiddleware.Instance;
  }
  public authorizationMiddleware(role: string[]) {
    return asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        if (req.curUser?.role == "admin" || req.curUser?.role == "manager") {
          return next();
        }
        if (!role.includes(req.curUser?.company?.companyRole)) {
          throw new CustomError(
            "unauthorized: Access denied",
            "Forbidden",
            false,
            403
          );
        }
        return next();
      }
    );
  }

  public activeCompanyMiddleware() {
    return asyncHandler(
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<Response | void> => {
        const companyId =
          req.params.id ||
          req.curUser?.company?.companyId ||
          req.body.companyId ||
          null;

        if (req.curUser?.role == "admin" || req.curUser?.role == "manager") {
          return next();
        }

        const company = await CompanySecurity.findOne({
          companyId,
        })
          .select("status")
          .lean();

        if (!company) {
          throw new CustomError("Company not found", "NotFound", false, 404);
        }

        if (company.status != "active") {
          throw new CustomError(
            "The company is currently inactive or does not exist.",
            "Forbidden",
            false,
            403
          );
        }
        return next();
      }
    );
  }
}
export default CompanyMiddleware;
