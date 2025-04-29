import AuthenticationMiddleware from "../middlewares/authentication.middleware";
import CompanyMiddleware from "../middlewares/company.middleware";
const authMiddleware = AuthenticationMiddleware.getInstance();
const companyMiddleware = CompanyMiddleware.getInstance();

export const userAuthorizationMiddlewares = [
  authMiddleware.refreshTokenMiddleware,
  authMiddleware.authorizationMiddleware(["user", "admin", "manager"]),
];

export const adminAuthorizationMiddlewares = [
  authMiddleware.refreshTokenMiddleware,
  authMiddleware.authorizationMiddleware(["admin", "manager"]),
];

export const companyViewerRoleMiddlewares = [
  ...userAuthorizationMiddlewares,
  companyMiddleware.authorizationMiddleware([
    "owner",
    "founder",
    "admin",
    "viewer",
  ]),
];

export const companyAdminRoleMiddlewares = [
  authMiddleware.refreshTokenMiddleware,
  authMiddleware.authorizationMiddleware(["user", "admin", "manager"]),
  companyMiddleware.authorizationMiddleware(["owner", "founder", "admin"]),
];
