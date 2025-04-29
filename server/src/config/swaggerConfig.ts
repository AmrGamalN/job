import { Application, NextFunction, Response, Request } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerOptions = (route: string): object => {
  return {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "JobLineces",
        version: "1.0.0",
        description: `API documentation for the ${route}`,
      },
      servers: [
        {
          url: "http://localhost:8080/api/v1",
          description: "Local server for development",
        },
      ],
    },
    apis: [
      `./src/routes/${route}/*.ts`,
      `./src/swaggers/components/${route}.ts`,
      `./src/swaggers/responses/${route}.ts`,
      `./src/swaggers/tags/${route}.ts`,
      `./src/swaggers/parameters/*.ts`,
    ],
  };
};

const routes = ["profile", "post", "company", "auth", "save"];
export const swaggerDoc = (app: Application) => {
  routes.forEach((routeName: string) => {
    const swaggerSpecs = swaggerJSDoc(swaggerOptions(routeName));
    app.use(
      `/api-docs/${routeName}`,
      swaggerUi.serve,
      (req: Request, res: Response, next: NextFunction) => {
        return swaggerUi.setup(swaggerSpecs, { explorer: true })(
          req,
          res,
          next
        );
      }
    );
  });
};
