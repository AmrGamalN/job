import { Request, Response } from "express";
import FaqService from "../../services/company/faq.service";
import { controllerResponse } from "../../utils/response.util";

class FaqController {
  private static instance: FaqController;
  private faqService: FaqService;

  constructor() {
    this.faqService = FaqService.getInstance();
  }

  static getInstance(): FaqController {
    if (!FaqController.instance) {
      FaqController.instance = new FaqController();
    }
    return FaqController.instance;
  }

  addFaq = async (req: Request, res: Response) => {
    const result = await this.faqService.addFaq(req.body, req.curUser?.userId);
    return controllerResponse(res, result);
  };

  getFaq = async (req: Request, res: Response) => {
    const result = await this.faqService.getFaq(req.params.id);
    return controllerResponse(res, result);
  };

  getAllFaqs = async (req: Request, res: Response) => {
    const result = await this.faqService.getAllFaqs(req.query, req.curUser);
    return controllerResponse(res, result);
  };

  countFaq = async (req: Request, res: Response) => {
    const result = await this.faqService.countFaq(req.query, req.curUser);
    return controllerResponse(res, result);
  };

  updateFaq = async (req: Request, res: Response) => {
    const result = await this.faqService.updateFaq(
      req.body,
      req.curUser,
      req.params.id
    );
    return controllerResponse(res, result);
  };

  deleteFaq = async (req: Request, res: Response) => {
    const result = await this.faqService.deleteFaq(req.params.id);
    return controllerResponse(res, result);
  };
}
export default FaqController;
