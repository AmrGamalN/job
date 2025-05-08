import Faq from "../../models/mongodb/company/faq.model";
import {
  FaqDto,
  FaqAddDto,
  FaqUpdateDto,
  FaqAddDtoType,
  FaqUpdateDtoType,
} from "../../dto/company/faq.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generateFilters } from "../../utils/generateFilters&Sort.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { FaqFiltersType } from "../../types/company.type";
import { UserRequestType } from "../../types/request.type";
import { ServiceResponseType } from "../../types/response.type";

class FaqService {
  private static instanceService: FaqService;
  public static getInstance(): FaqService {
    if (!FaqService.instanceService) {
      FaqService.instanceService = new FaqService();
    }
    return FaqService.instanceService;
  }

  addFaq = warpAsync(
    async (
      data: FaqAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: FaqAddDto,
      });
      if (!validationResult.success) return validationResult;

      const existingFaq = await Faq.findOne({
        companyId: data.companyId,
        status: "pending",
      }).lean();

      if (existingFaq) {
        return serviceResponse({
          statusText: "Conflict",
          message:
            "A FAQ entry for this company already exists and is currently pending review. Adding a new entry is not allowed at this time.",
        });
      }

      await Faq.create({
        ...data,
        userId,
      });

      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getFaq = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await Faq.findById({ _id }).lean(),
      userDto: FaqDto,
    });
  });

  getAllFaqs = warpAsync(
    async (
      queries: FaqFiltersType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<FaqFiltersType>(queries);
      const count = await this.countFaq(filters, user, true);
      return await generatePagination({
        model: Faq,
        userDto: FaqDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: filters,
      });
    }
  );

  countFaq = warpAsync(
    async (
      queries: FaqFiltersType,
      user: UserRequestType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<FaqFiltersType>(queries, undefined, user);
      return serviceResponse({
        count: await Faq.countDocuments(filters),
      });
    }
  );

  updateFaq = warpAsync(
    async (
      data: FaqUpdateDtoType,
      user: UserRequestType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: FaqUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const { userId, companyId, ...queries } = this.updateFaqBasedRole(data, user);
      const updateFaq = await Faq.updateOne(
        {
          $or: [
            { _id, userId },
            { _id, companyId },
          ],
        },
        {
          $set: {
            ...queries,
          },
        }
      );
      return serviceResponse({
        data: updateFaq.modifiedCount,
      });
    }
  );

  deleteFaq = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return serviceResponse({
      data: (await Faq.deleteOne({ _id })).deletedCount,
    });
  });

  private updateFaqBasedRole = (
    data: FaqUpdateDtoType,
    user: UserRequestType
  ): Record<string, any> => {
    let queries: Record<string, any> = {};
    if (["owner", "founder", "admin"].includes(user.company.companyRole)) {
      queries = data;
      queries["companyId"] = user.company.companyId;
    } else {
      queries["department"] = data.department;
      queries["question"] = data.question;
      queries["questionType"] = data.questionType;
      queries["userType"] = data.userType;
      queries["userId"] = user.userId;
    }
    return queries;
  };
}

export default FaqService;
