import { Request, Response } from "express";
import AddressService from "../../services/client/address.service";
import { controllerResponse } from "../../utils/response.util";

class AddressController {
  private static instance: AddressController;
  private addressService: AddressService;
  constructor() {
    this.addressService = AddressService.getInstance();
  }
  static getInstance(): AddressController {
    if (!AddressController.instance) {
      AddressController.instance = new AddressController();
    }
    return AddressController.instance;
  }

  async addAddress(req: Request, res: Response): Promise<Response> {
    const ownerTypes = req.originalUrl.includes("company")
      ? "company"
      : req.originalUrl.includes("school")
      ? "school"
      : "user";
    const result = await this.addressService.addAddress(
      req.body,
      req.curUser?.userId,
      ownerTypes
    );
    return controllerResponse(res, result);
  }

  async getAddress(req: Request, res: Response): Promise<Response> {
    const result = await this.addressService.getAddress(
      req.body.data,
      req.curUser.role
    );
    return controllerResponse(res, result);
  }

  async updateAddress(req: Request, res: Response): Promise<Response> {
    const result = await this.addressService.updateAddress(
      req.body,
      req.params.id
    );
    return controllerResponse(res, result);
  }

  async deleteAddress(req: Request, res: Response): Promise<Response> {
    const result = await this.addressService.deleteAddress(req.params.id);
    return controllerResponse(res, result);
  }
}

export default AddressController;
