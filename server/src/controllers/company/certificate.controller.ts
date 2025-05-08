import { Request, Response } from "express";
import CertificateService from "../../services/company/certificate.service";
import { controllerResponse } from "../../utils/response.util";

export default class CertificateController {
  private static instance: CertificateController;
  private certificateService: CertificateService;

  constructor() {
    this.certificateService = CertificateService.getInstance();
  }

  static getInstance(): CertificateController {
    if (!CertificateController.instance) {
      CertificateController.instance = new CertificateController();
    }
    return CertificateController.instance;
  }

  addCertificate = async (req: Request, res: Response) => {
    const result = await this.certificateService.addCertificate(
      req.body,
      req.curUser?.userId,
      req.curUser?.company.companyId
    );
    return controllerResponse(res, result);
  };

  getCertificate = async (req: Request, res: Response) => {
    const result = await this.certificateService.getCertificate(req.params.id);
    return controllerResponse(res, result);
  };

  getAllCertificates = async (req: Request, res: Response) => {
    const result = await this.certificateService.getAllCertificates(
      req.query,
      req.curUser?.company.companyId
    );
    return controllerResponse(res, result);
  };

  countCertificate = async (req: Request, res: Response) => {
    const result = await this.certificateService.countCertificate(
      req.query,
      req.curUser?.company.companyId
    );
    return controllerResponse(res, result);
  };

  updateCertificate = async (req: Request, res: Response) => {
    const result = await this.certificateService.updateCertificate(
      req.body,
      req.params.id,
      req.curUser?.userId,
    );
    return controllerResponse(res, result);
  };

  deleteCertificate = async (req: Request, res: Response) => {
    const result = await this.certificateService.deleteCertificate(
      req.params.id,
    );
    return controllerResponse(res, result);
  };
}
