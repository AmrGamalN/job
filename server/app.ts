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
import router from "./src/router";
import { redisClient } from "./src/config/redisConfig";
import { errorMiddleware } from "./src/middleware/handleError";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./src/graphql/main.graphql";
import { resolvers } from "./src/graphql/main.graphql";

const swaggerDocs = swaggerJSDoc(swaggerOptions);
const app: Application = express();

const corsOption: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(xssClean());

// app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/v1", router);
const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    formatError: (err) => ({
      message: err.message,
      status: err.extensions?.code || 500,
      success: false,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      path: err.path,
      name: err.name,
    }),
  });
  await server.start();
  server.applyMiddleware({ app: app as any, path: "/graphql" });
};
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Page not found" });
});
app.use(errorMiddleware);

Promise.all([connectToMongoDB(), redisClient.connect()])
  .then(() => {
    startApolloServer();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error while connecting to MongoDB or Redis:", error);
  });
