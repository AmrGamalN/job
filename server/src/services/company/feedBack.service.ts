// Models
import FeedBack from "../../models/mongodb/company/feedBack.model";
import Member from "../../models/mongodb/company/member.model";
import CompanySecurity from "../../models/mongodb/company/security.model";
import Security from "../../models/mongodb/client/security.model";
import {
  FeedBackDto,
  FeedBackUpdateDto,
  FeedBackUpdateDtoType,
} from "../../dto/company/feedBack.dto";
import { CompanyDtoType } from "../../dto/company/company.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { CustomError } from "../../utils/customError.util";
import { ServiceResponseType, ResponseType } from "../../types/response.type";
import { FeedbackFiltersType } from "../../types/company.type";
import mongoose from "mongoose";
import { generateFilters } from "../../utils/generateFilters&Sort.util";

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
      _id: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: FeedBackUpdateDto,
      });
      if (!validationResult.success) return validationResult;

      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const getFeedBack = await FeedBack.findOneAndUpdate(
            { _id },
            {
              $set: {
                ...data,
                updateBy: userId,
              },
            },
            { new: true, session }
          );

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
          ).populate<{
            companyId: CompanyDtoType;
          }>({
            path: "companyId",
            select: "_id companyEmail userId",
          });
          if (!getCompany?.companyId)
            throw new CustomError("Company not found", "NotFound", false, 404);

          if (data?.status === "active") {
            const getMember = await Member.exists({
              userId: getCompany?.companyId.userId,
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
                  userId: getCompany?.companyId.userId,
                  status: data.status,
                  companyRole: "owner",
                },
              ],
              { session }
            );

            await Security.updateOne(
              { userId: getCompany?.companyId.userId },
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

  getFeedBack = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await FeedBack.findById({
        _id,
      }).lean(),
      userDto: FeedBackDto,
    });
  });

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
      return validateAndFormatData({
        data: getFeedBack,
        userDto: FeedBackDto,
      });
    }
  );

  getAllFeedBack = warpAsync(
    async (queries: FeedbackFiltersType): Promise<ServiceResponseType> => {
      const filters = generateFilters<FeedbackFiltersType>(queries);
      const count = await this.countFeedBack(filters, true);
      return await generatePagination({
        model: FeedBack,
        userDto: FeedBackDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: filters,
      });
    }
  );

  countFeedBack = warpAsync(
    async (
      queries: FeedbackFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<FeedbackFiltersType>(queries);
      return serviceResponse({
        count: await FeedBack.countDocuments(filters),
      });
    }
  );

  deleteFeedBack = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        deletedCount: (await FeedBack.deleteOne({ _id })).deletedCount,
      });
    }
  );
}
export default FeedBackService;
