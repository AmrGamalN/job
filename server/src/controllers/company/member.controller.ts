import { Request, Response } from "express";
import MemberService from "../../services/company/member.service";
import { controllerResponse } from "../../utils/response.util";

class MemberController {
  private static instance: MemberController;
  private memberService: MemberService;

  constructor() {
    this.memberService = MemberService.getInstance();
  }

  static getInstance(): MemberController {
    if (!MemberController.instance) {
      MemberController.instance = new MemberController();
    }
    return MemberController.instance;
  }

  addMember = async (req: Request, res: Response) => {
    const result = await this.memberService.addMember(
      req.body,
      req.curUser?.userId,
      req.curUser?.company.companyId
    );
    return controllerResponse(res, result);
  };

  getMember = async (req: Request, res: Response) => {
    const result = await this.memberService.getMember(req.params.id);
    return controllerResponse(res, result);
  };

  getAllMembers = async (req: Request, res: Response) => {
    const result = await this.memberService.getAllMembers(
      req.query,
      req.curUser?.company.companyId
    );
    return controllerResponse(res, result);
  };

  countMember = async (req: Request, res: Response) => {
    const result = await this.memberService.countMember(
      req.query,
      req.curUser?.company.companyId
    );
    return controllerResponse(res, result);
  };

  updateMember = async (req: Request, res: Response) => {
    const result = await this.memberService.updateMember(
      req.body,
      req.params.id
    );
    return controllerResponse(res, result);
  };

  deleteMember = async (req: Request, res: Response) => {
    const result = await this.memberService.deleteMember(req.params.id);
    return controllerResponse(res, result);
  };
}
export default MemberController;
