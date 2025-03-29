import winston from "winston";
import path from "path";

export const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logger/error.log"),
      level: "error",
    }),
    new winston.transports.Console(),
  ],
});
