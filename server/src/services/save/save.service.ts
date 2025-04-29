import Save from "../../models/mongodb/save/save.model";
import { SaveDto, SaveAddDtoType, SaveAddDto } from "../../dto/save/save.dto";
import { paginate } from "../../utils/pagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import { SaveFiltersType } from "../../types/save.type";
import { UserRequestType } from "../../types/request.type";

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
      saveData: SaveAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(saveData, SaveAddDto);
      if (!validationResult.success) return validationResult;

      const existingSave = await Save.findOne({
        actorId: userId,
        targetId: saveData.targetId,
      }).lean();
      if (existingSave)
        return serviceResponse({
          statusText: "Conflict",
          message: "This save already exists",
        });

      if (userId == saveData.targetId)
        return serviceResponse({
          statusText: "Conflict",
          message: "You cannot save yourself",
        });

      await Save.create({
        ...saveData,
        actorId: userId,
      });

      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getSave = warpAsync(
    async (saveId: string, userId: string): Promise<ServiceResponseType> => {
      const getSave = await Save.findOne({ _id: saveId, actorId:userId }).lean();
      return validateAndFormatData(getSave, SaveDto);
    }
  );

  getAllSaves = warpAsync(
    async (
      filters: SaveFiltersType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      const count = await this.countSave(filters, user);
      return await paginate(
        Save,
        SaveDto,
        count.count ?? 0,
        {
          page: filters.page,
          limit: filters.limit,
        },
        null,
        { ...this.filterSaves(filters), actorId: user.userId }
      );
    }
  );

  countSave = warpAsync(
    async (
      filters: SaveFiltersType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Save.countDocuments({
          ...this.filterSaves(filters),
          actorId: user.userId,
        }),
      });
    }
  );

  deleteSave = warpAsync(
    async (saveId: string, actorId: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Save.deleteOne({ _id: saveId, actorId })).deletedCount,
      });
    }
  );

  private filterSaves = (queries: SaveFiltersType) => {
    const filtersOption: (keyof typeof queries)[] = ["targetType"];
    let filters: Record<string, string | object> = {};

    if (queries.start && queries.end) {
      filters["createdAt"] = { $gte: queries.start, $lte: queries.end };
    }
    for (const key of filtersOption) {
      if (queries[key] && typeof queries[key] == "string")
        filters[key] = queries[key];
    }
    return filters;
  };
}

export default SaveService;
