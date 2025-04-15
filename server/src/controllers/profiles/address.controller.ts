import { Request, Response } from "express";
import AddressService from "../../services/profiles/address.service";

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
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Get address
  async getAddress(req: Request, res: Response): Promise<Response> {
    const query = req.params.addressId ? {_id:req.params.addressId} : {userId:req.curUser?.userId};
    const result = await this.addressService.getAddress(query);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Update address
  async updateAddress(req: Request, res: Response): Promise<Response> {
    const query = req.params.addressId ? {_id:req.params.addressId} : {userId:req.curUser?.userId};
    const result = await this.addressService.updateAddress(req.body, query);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }
}

export default AddressController;
