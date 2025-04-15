import bodyParser from "body-parser";
import express, { Application, NextFunction, Response, Request } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./src/config/swaggerConfig";
import connectToMongoDB from "./src/config/mongooseConfig";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
const xssClean = require("xss-clean");
import { CorsOptions } from "cors";
const { graphqlHTTP } = require("express-graphql");
import router from "./src/router";
import schema from "./src/graphql/main.graphql";
import { redisClient } from "./src/config/redisConfig";
import { formatError, GraphQLError } from "graphql";
import { errorMiddleware } from "./src/middleware/handleError";
import { debug } from "console";


// Define express app & swagger
const swaggerDocs = swaggerJSDoc(swaggerOptions);
const app: Application = express();

// Cors options
const corsOption: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(xssClean());

// Routes && Graphql && swagger
// app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/v1", router);
app.use(
  "/graphql",
  graphqlHTTP((req: Request, res: Response) => ({
    schema,
    graphiql: true,
    context: { req, res },
    debug: true,
    customFormatErrorFn: (err: GraphQLError) => {
      if (process.env.NODE_ENV === "development") {
        return {
          message: err.message || "Internal Server Error",
          status: err.extensions?.code || 500,
          success: false,
          stack: err.stack,
          path: err.path,
          name: err.name,
        };
      }
    },
  }))
);

// Middleware used to check any path not found in route
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Page not found" });
});

// Error handle middleware
app.use(errorMiddleware);

Promise.all([connectToMongoDB(), redisClient.connect()]);
app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
