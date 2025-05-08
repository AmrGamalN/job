import Help from "../../models/mongodb/support/help.model";
import {
  HelpDto,
  HelpAddDtoType,
  HelpAddDto,
  HelpUpdateDtoType,
  HelpUpdateDto,
} from "../../dto/support/help.dto";
import { generatePagination } from "../../utils/generatePagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import { HelpFiltersType } from "../../types/support.type";
import { generateFilters } from "../../utils/generateFilters&Sort.util";

class HelpService {
  private static instanceService: HelpService;
  public static getInstance(): HelpService {
    if (!HelpService.instanceService) {
      HelpService.instanceService = new HelpService();
    }
    return HelpService.instanceService;
  }

  addHelp = warpAsync(
    async (
      data: HelpAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: HelpAddDto,
      });
      if (!validationResult.success) return validationResult;
      await Help.create({
        ...data,
        userId,
      });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getHelp = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await Help.findById({ _id }).lean(),
      userDto: HelpDto,
    });
  });

  getAllHelps = warpAsync(
    async (
      queries: HelpFiltersType,
      userId: string,
      role: string
    ): Promise<ServiceResponseType> => {
      const id = role === "admin" || role === "manager" ? null : { userId };
      const filters = generateFilters<HelpFiltersType>(queries);
      const count = await this.countHelp(id, filters, true);
      return await generatePagination({
        model: Help,
        userDto: HelpDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { ...id, ...filters },
      });
    }
  );

  countHelp = warpAsync(
    async (
      userId: object,
      queries: HelpFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<HelpFiltersType>(queries);
      return serviceResponse({
        count: await Help.countDocuments({ ...userId, ...filters }),
      });
    }
  );

  updateHelp = warpAsync(
    async (
      data: HelpUpdateDtoType,
      _id: string,
      reviewedBy: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: HelpUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateHelp = await Help.updateOne(
        { _id },
        {
          $set: {
            ...data,
            reviewedBy,
            reviewedAt: new Date(),
          },
        }
      );
      return serviceResponse({
        data: updateHelp,
      });
    }
  );

  deleteHelp = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Help.deleteOne({ _id })).deletedCount,
      });
    }
  );
}

export default HelpService;
