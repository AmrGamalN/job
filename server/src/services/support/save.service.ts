import Save from "../../models/mongodb/support/save.model";
import {
  SaveDto,
  SaveAddDtoType,
  SaveAddDto,
} from "../../dto/support/save.dto";
import { generatePagination } from "../../utils/generatePagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import { SaveFiltersType } from "../../types/support.type";
import { generateFilters } from "../../utils/generateFilters&Sort.util";

class SaveService {
  private static instanceService: SaveService;
  public static getInstance(): SaveService {
    if (!SaveService.instanceService) {
      SaveService.instanceService = new SaveService();
    }
    return SaveService.instanceService;
  }

  addSave = warpAsync(
    async (
      data: SaveAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: SaveAddDto,
      });
      if (!validationResult.success) return validationResult;

      const existingSave = await Save.findOne({
        userId: userId,
        targetId: data.targetId,
      }).lean();
      if (existingSave)
        return serviceResponse({
          statusText: "Conflict",
          message: "This save already exists",
        });

      if (userId == data.targetId)
        return serviceResponse({
          statusText: "Conflict",
          message: "You cannot save yourself",
        });

      await Save.create({
        ...data,
        userId,
      });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getSave = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await Save.findById({ _id }).lean(),
      userDto: SaveDto,
    });
  });

  getAllSaves = warpAsync(
    async (
      queries: SaveFiltersType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<SaveFiltersType>(queries);
      const count = await this.countSave(userId, filters, true);
      return await generatePagination({
        model: Save,
        userDto: SaveDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { ...filters, userId },
      });
    }
  );

  countSave = warpAsync(
    async (
      userId: string,
      queries: SaveFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<SaveFiltersType>(queries);
      return serviceResponse({
        count: await Save.countDocuments({
          ...filters,
          userId,
        }),
      });
    }
  );

  deleteSave = warpAsync(
    async (_id: string, userId: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Save.deleteOne({ _id, userId })).deletedCount,
      });
    }
  );
}

export default SaveService;
