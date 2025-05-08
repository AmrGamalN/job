import { Request, Response } from "express";
import DocumentService from "../../services/company/document.service";
import { controllerResponse } from "../../utils/response.util";

export default class DocumentController {
  private static instance: DocumentController;
  private documentService: DocumentService;

  constructor() {
    this.documentService = DocumentService.getInstance();
  }

  static getInstance(): DocumentController {
    if (!DocumentController.instance) {
      DocumentController.instance = new DocumentController();
    }
    return DocumentController.instance;
  }

  addDocument = async (req: Request, res: Response) => {
    const result = await this.documentService.addDocument(
      req.body,
      req.curUser?.userId,
      req.curUser?.company.companyId
    );
    return controllerResponse(res, result);
  };

  getDocument = async (req: Request, res: Response) => {
    const result = await this.documentService.getDocument(req.params.id);
    return controllerResponse(res, result);
  };

  getAllDocuments = async (req: Request, res: Response) => {
    const result = await this.documentService.getAllDocuments(
      req.query,
      req.curUser?.company.companyId
    );
    return controllerResponse(res, result);
  };

  countDocument = async (req: Request, res: Response) => {
    const result = await this.documentService.countDocument(
      req.query,
      req.curUser?.company.companyId
    );
    return controllerResponse(res, result);
  };

  updateDocument = async (req: Request, res: Response) => {
    const result = await this.documentService.updateDocument(
      req.body,
      req.params.id,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  };

  deleteDocument = async (req: Request, res: Response) => {
    const result = await this.documentService.deleteDocument(req.params.id);
    return controllerResponse(res, result);
  };
}
