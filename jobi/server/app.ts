import bodyParser from "body-parser";
import express, { Application, NextFunction, Response, Request } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./src/config/swaggerConfig";
import connectToMongoDB from "./src/config/mongooseConfig";
import router from "./src/router";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
const xssClean = require("xss-clean");
import { CorsOptions } from "cors";

// Define express app & swagger
const swaggerDocs = swaggerJSDoc(swaggerOptions);
const app: Application = express();

// Cors options
const corsOption: CorsOptions = {
  origin: "http://localhost:3000",
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

// Routes
app.use("/api/v1", router);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware used to check any path not found in route
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Page not found" });
});

// Error handle middleware

Promise.all([connectToMongoDB]);
app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
