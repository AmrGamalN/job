// Models
import FeedBack from "../../models/mongodb/company/feedBack.model";
import Member from "../../models/mongodb/company/member.model";
import CompanySecurity from "../../models/mongodb/company/security.model";
import Security from "../../models/mongodb/profiles/security.model";
import {
  FeedBackDto,
  FeedBackUpdateDto,
  FeedBackUpdateDtoType,
} from "../../dto/company/feedBack.dto";
import { CompanyDtoType } from "../../dto/company/company.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { paginate } from "../../utils/pagination.util";
import { CustomError } from "../../utils/customErr.util";
import { ServiceResponseType, ResponseType } from "../../types/response.type";
import { FeedbackFiltersType } from "../../types/company.type";
import mongoose from "mongoose";

class FeedBackService {
  private static instanceService: FeedBackService;
  public static getInstance(): FeedBackService {
    if (!FeedBackService.instanceService) {
      FeedBackService.instanceService = new FeedBackService();
    }
    return FeedBackService.instanceService;
  }

  updateCompanyStatus = warpAsync(
    async (
      data: FeedBackUpdateDtoType,
      feedBackId: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        data,
        FeedBackUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const getFeedBack = await FeedBack.findOneAndUpdate(
            { _id: feedBackId },
            {
              $set: {
                ...data,
                updateBy: userId,
              },
            },
            { new: true, session }
          ).lean();

          if (!getFeedBack)
            throw new CustomError("FeedBack not found", "NotFound", false, 404);

          const getCompany = await CompanySecurity.findOneAndUpdate(
            { companyId: getFeedBack?.companyId },
            {
              $set: {
                status: data.status,
              },
            },
            { new: true, session }
          )
            .populate<{
              companyId: CompanyDtoType;
            }>({
              path: "companyId",
              select: "_id companyEmail ownerId",
            })
            .lean();

          if (!getCompany?.companyId)
            throw new CustomError("Company not found", "NotFound", false, 404);

          if (data?.status === "active") {
            const getMember = await Member.exists({
              userId: getCompany?.companyId.ownerId,
              companyId: getCompany?.companyId._id,
            });
            if (getMember)
              throw new CustomError(
                "User already exists in company",
                "Conflict",
                false,
                409
              );

            const [member] = await Member.create(
              [
                {
                  companyId: getCompany?.companyId._id,
                  email: getCompany?.companyId.companyEmail,
                  userId: getCompany?.companyId.ownerId,
                  status: data.status,
                  companyRole: "owner",
                },
              ],
              { session }
            );

            await Security.updateOne(
              { userId: getCompany?.companyId.ownerId },
              {
                $set: {
                  company: {
                    companyId: getCompany?.companyId._id,
                    memberId: member?._id,
                    companyRole: "owner",
                  },
                },
              },
              { session }
            );
          }
        });
        return serviceResponse({
          statusText: "OK",
          message: "FeedBack status updated successfully and member created.",
        });
      } catch (err: any) {
        if (err instanceof CustomError)
          return serviceResponse({
            statusText: err.statusText as ResponseType,
            message: err.message,
          });

        return serviceResponse({
          statusText: "InternalServerError",
          message: "Something went wrong. Please try again later.",
        });
      } finally {
        await session.endSession();
      }
    }
  );

  getFeedBack = warpAsync(
    async (feedBackId: string): Promise<ServiceResponseType> => {
      const getFeedBack = await FeedBack.findOne({
        _id: new mongoose.Types.ObjectId(feedBackId),
      }).lean();
      return validateAndFormatData(getFeedBack, FeedBackDto);
    }
  );

  getFeedBackByLink = warpAsync(
    async (link: string): Promise<ServiceResponseType> => {
      const split = link.split("-")[1];
      if (split?.length != 70) {
        return serviceResponse({
          statusText: "NotFound",
        });
      }
      const getFeedBack = await FeedBack.findOne({
        feedBackLink: link,
      }).lean();
      return validateAndFormatData(getFeedBack, FeedBackDto);
    }
  );

  getAllFeedBack = warpAsync(
    async (filters: FeedbackFiltersType): Promise<ServiceResponseType> => {
      const count = await this.countFeedBack(filters);
      return await paginate(
        FeedBack,
        FeedBackDto,
        count.count ?? 0,
        { page: filters.page, limit: filters.limit },
        null,
         this.filterFeedbacks(filters) 
      );
    }
  );

  countFeedBack = warpAsync(
    async (filters: FeedbackFiltersType): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await FeedBack.countDocuments(this.filterFeedbacks(filters)),
      });
    }
  );

  deleteFeedBack = warpAsync(
    async (feedBackId: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        deleteCount: (await FeedBack.deleteOne({ _id: feedBackId }))
          .deletedCount,
      });
    }
  );

  private filterFeedbacks = (queries: FeedbackFiltersType) => {
    const filtersOption: (keyof typeof queries)[] = ["status", "companyName"];
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
export default FeedBackService;
