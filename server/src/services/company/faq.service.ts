import Faq from "../../models/mongodb/company/faq.model";
import {
  FaqDto,
  FaqAddDto,
  FaqUpdateDto,
  FaqAddDtoType,
  FaqUpdateDtoType,
  FaqDtoType,
} from "../../dto/company/faq.dto";
import { paginate } from "../../utils/pagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import { FaqFiltersType } from "../../types/company.type";
import { UserRequestType } from "../../types/request.type";

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
      faqData: FaqAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(faqData, FaqAddDto);
      if (!validationResult.success) return validationResult;

      const existingFaq = await Faq.findOne({
        companyId: faqData.companyId,
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
        ...faqData,
        userId,
      });

      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getFaq = warpAsync(async (faqId: string): Promise<ServiceResponseType> => {
    const getFaq = await Faq.findOne({ _id: faqId }).lean();
    return validateAndFormatData(getFaq, FaqDto);
  });

  getAllFaqs = warpAsync(
    async (
      filters: FaqFiltersType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      const count = await this.countFaq(filters, user);
      return await paginate(
        Faq,
        FaqDto,
        count.count ?? 0,
        {
          page: filters.page,
          limit: filters.limit,
        },
        null,
        this.filterFaqs(filters, user)
      );
    }
  );

  countFaq = warpAsync(
    async (
      filters: FaqFiltersType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Faq.countDocuments(this.filterFaqs(filters, user)),
      });
    }
  );

  updateFaq = warpAsync(
    async (
      FaqData: FaqUpdateDtoType,
      user: UserRequestType,
      faqId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        FaqData,
        FaqUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const { userId, companyId, ...queries } = this.helperUpdate(
        FaqData,
        user
      );
      const updateFaq = await Faq.updateOne(
        {
          $or: [
            { _id: faqId, userId },
            { _id: faqId, companyId },
          ],
        },
        {
          $set: {
            ...queries,
          },
        }
      ).lean();
      return serviceResponse({
        data: updateFaq.modifiedCount,
      });
    }
  );

  deleteFaq = warpAsync(async (faqId: string): Promise<ServiceResponseType> => {
    return serviceResponse({
      data: (await Faq.deleteOne({ _id: faqId })).deletedCount,
    });
  });

  private helperUpdate = (
    FaqData: FaqUpdateDtoType,
    user: UserRequestType
  ): Record<string, any> => {
    let queries: Record<string, any> = {};
    if (["owner", "founder", "admin"].includes(user.company.companyRole)) {
      queries = FaqData;
      queries["companyId"] = user.company.companyId;
    } else {
      queries["department"] = FaqData.department;
      queries["question"] = FaqData.question;
      queries["questionType"] = FaqData.questionType;
      queries["userType"] = FaqData.userType;
      queries["userId"] = user.userId;
    }
    return queries;
  };

  private filterFaqs = (queries: FaqFiltersType, user: UserRequestType) => {
    const filtersOption: (keyof typeof queries)[] = [
      "questionType",
      "department",
      "status",
    ];
    let filters: Record<string, string | object> = {};

    if (queries.start && queries.end) {
      filters["createdAt"] = { $gte: queries.start, $lte: queries.end };
    }

    const isViewerOrMember =
      user.role === "user" &&
      (user.company.companyRole === "viewer" ||
        user.company.companyRole === "member");
    if (isViewerOrMember) {
      filters["userId"] = user.userId;
    } else {
      filters["companyId"] = user.company.companyId;
      if (queries.userType) {
        filters["userType"] = queries.userType;
      }
    }

    for (const key of filtersOption) {
      if (queries[key] && typeof queries[key] == "string")
        filters[key] = queries[key];
    }
    return filters;
  };
}

export default FaqService;
