import { Request, Response } from "express";
import CompanyService from "../../services/company/company.service";
import { controllerResponse } from "../../utils/response.util";

class CompanyController {
  private static instance: CompanyController;
  private companyService: CompanyService;
  constructor() {
    this.companyService = CompanyService.getInstance();
  }
  static getInstance(): CompanyController {
    if (!CompanyController.instance) {
      CompanyController.instance = new CompanyController();
    }
    return CompanyController.instance;
  }

  async addCompany(req: Request, res: Response): Promise<Response> {
    const result = await this.companyService.addCompany(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getCompany(req: Request, res: Response): Promise<Response> {
    const result = await this.companyService.getCompany(req.params.id);
    return controllerResponse(res, result);
  }

  async getAllCompanies(req: Request, res: Response): Promise<Response> {
    const result = await this.companyService.getAllCompanies(
      req.query,
      req.curUser.role
    );
    return controllerResponse(res, result);
  }

  async updateCompany(req: Request, res: Response): Promise<Response> {
    const result = await this.companyService.updateCompany(
      req.body,
      req.params.id
    );
    return controllerResponse(res, result);
  }

  async countCompany(req: Request, res: Response): Promise<Response> {
    const result = await this.companyService.countCompany(
      req.query,
      req.curUser.role
    );
    return controllerResponse(res, result);
  }

  async deleteCompany(req: Request, res: Response): Promise<Response> {
    const result = await this.companyService.deleteCompany(req.params.id);
    return controllerResponse(res, result);
  }
}

export default CompanyController;
