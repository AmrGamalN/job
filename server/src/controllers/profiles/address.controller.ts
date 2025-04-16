import { Request, Response } from "express";
import AddressService from "../../services/profiles/address.service";
import { handleApiResponse } from "../../utils/responseHandler";

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

  // Add address
  async addAddress(req: Request, res: Response): Promise<Response> {
    const userId = req.curUser?.userId;
    const result = await this.addressService.addAddress(req.body, userId);
    return handleApiResponse(res, result);
  }

  // Get address
  async getAddress(req: Request, res: Response): Promise<Response> {
    const query = req.params.addressId
      ? { _id: req.params.addressId }
      : { userId: req.curUser?.userId };
    const result = await this.addressService.getAddress(query);
    return handleApiResponse(res, result);
  }

  // Update address
  async updateAddress(req: Request, res: Response): Promise<Response> {
    const query = req.params.addressId
      ? { _id: req.params.addressId }
      : { userId: req.curUser?.userId };
    const result = await this.addressService.updateAddress(req.body, query);
    return handleApiResponse(res, result);
  }
}

export default AddressController;
