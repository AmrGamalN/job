import { NextFunction, Request, Response } from "express";
const parserFieldArray = ["tags", "technologies", "department", "legalInfo"];
const parserFieldObject = ["legalInfo"];
const parserImages = ["companyLogo", "profileImage", "coverImage"];
const mimeTypesDocuments: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "document",
  "application/vnd.ms-powerpoint": "powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "spreadsheet",
  "application/vnd.ms-excel": "excel",
};

export const parseFieldsMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    let hasError = false;
    for (const field in req.body) {
      const value = req.body[field.trim()];
      if (value && typeof value === "string") {
        try {
          if (parserFieldArray.includes(field)) {
            req.body[field] = value?.split(",");
          }
          if (parserFieldObject.includes(field)) {
            req.body[field] = JSON.parse(value);
          }
        } catch (err) {
          if (!hasError) {
            hasError = true;
            return res.status(400).json({
              statusText: "BadRequest",
              success: false,
              status: 400,
              message: `Invalid field "${field}"`,
            });
          }
        }
      }
    }
    return next();
  };
};

export const checkFilesMiddleware = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    if (req.file && fields.includes(req.file.fieldname)) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: `${fields} is required`,
    });
  };
};

export const parserImagesMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.files && !req.file) {
      return next();
    }

    if (req.file?.fieldname == "documentFile") {
      req.body.documentFile = {
        documentUrl: req.file?.filename,
        documentType: mimeTypesDocuments[req.file?.mimetype],
      };
      return next();
    }

    for (const field in req.files) {
      if (parserImages.includes(field)) {
        const images = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        req.body[field] = images[field].reduce((acc, currentFile) => {
          return {
            imageUrl: currentFile.filename,
            imageKey: currentFile.filename,
          };
        }, {});
      }
    }
    return next();
  };
};
