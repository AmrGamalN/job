import { Request, Response } from "express";
import AddressService from "../../services/profiles/address.service";
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
    const result = await this.addressService.addAddress(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getAddress(req: Request, res: Response): Promise<Response> {
    const result = await this.addressService.getAddress(
      req.body.id,
      req.body.ownerType
    );
    return controllerResponse(res, result);
  }

  async updateAddress(req: Request, res: Response): Promise<Response> {
    const result = await this.addressService.updateAddress(
      req.body,
      req.body.id,
      req.body.ownerType
    );
    return controllerResponse(res, result);
  }
}

export default AddressController;
