import multer, { MulterError } from "multer";
import { NextFunction, Request, Response } from "express";
import path from "path";
import { asyncHandler } from "./handleError.middleware";
import { CustomError } from "../utils/customError.util";
const uploadDir = path.join(__dirname, "../upload");
const mimeTypesImages = ["image/jpeg", "image/png", "image/jpg"];
const mimeTypesDocuments = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

const fileFilterValidator = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const type = file.mimetype.toLowerCase();
  if (file.fieldname === "documentFile") {
    if (mimeTypesDocuments.includes(type)) return callback(null, true);
    return callback(
      new CustomError(
        "Only .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx format allowed!",
        "BadRequest",
        false,
        400
      )
    );
  }

  if (file.fieldname === "cv") {
    if (type == "application/pdf") return callback(null, true);
    return callback(new CustomError("Only .pdf", "BadRequest", false, 400));
  }

  if (mimeTypesImages.includes(type)) return callback(null, true);
  return callback(
    new CustomError(
      "Only .png, .jpg and .jpeg format allowed!",
      "BadRequest",
      false,
      400
    )
  );
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilterValidator,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadFile =
  (uploadMiddleware: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
      if (!err) return next();

      const status = err instanceof MulterError ? 400 : 500;
      const message =
        err instanceof MulterError
          ? `File upload error: ${err.message}`
          : `Unknown file upload error`;

      res.status(status).json({
        success: false,
        message,
        error: err.message,
      });
    });
  };

export const uploadImageProfile = asyncHandler(
  uploadFile(
    upload.fields([
      { maxCount: 1, name: "profileImage" },
      { maxCount: 1, name: "coverImage" },
      { maxCount: 1, name: "companyLogo" },
    ])
  )
);

export const companyUploadDocument = asyncHandler(
  uploadFile(upload.single("documentFile"))
);

export const jobAppUpload = asyncHandler(
  uploadFile(
    upload.fields([
      { maxCount: 1, name: "cv" },
      { maxCount: 1, name: "idImage" },
    ])
  )
);
