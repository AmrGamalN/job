import { Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      controllerMethod?: string;
    }
  }

}

//   interface CustomRequest extends Request {
//     params: {
//       id?: any | null;
//       [key: string]: any;
//     };
//   }
// }
