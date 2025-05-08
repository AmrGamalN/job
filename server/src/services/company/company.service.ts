import Company from "../../models/mongodb/company/company.model";
import FeedBack from "../../models/mongodb/company/feedBack.model";
import Security from "../../models/mongodb/client/security.model";
import Activity from "../../models/mongodb/Analytics/activity.model";
import Interest from "../../models/mongodb/client/interest.model";
import CompanySecurity from "../../models/mongodb/company/security.model";
import {
  CompanyBaseDto,
  CompanyAddDto,
  CompanyUpdateDto,
  CompanyAddDtoType,
  CompanyUpdateDtoType,
} from "../../dto/company/security.dto";
import { CompanyDtoType } from "../../dto/company/company.dto";
import { sendEmail } from "../../utils/sendEmail.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { CustomError } from "../../utils/customError.util";
import { serviceResponse } from "../../utils/response.util";
import { generateLink } from "../../utils/generateUniqueLink.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { generateFilters } from "../../utils/generateFilters&Sort.util";
import {
  sendCompanyEmail,
  sendCompanyStatusMessage,
} from "../../utils/emailMessage.util";
import { ServiceResponseType, ResponseType } from "../../types/response.type";
import { CompanyFiltersType } from "../../types/company.type";
import { UserRoleType } from "../../types/role.type";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

class CompanyService {
  private static instanceService: CompanyService;

  public static getInstance(): CompanyService {
    if (!CompanyService.instanceService) {
      CompanyService.instanceService = new CompanyService();
    }
    return CompanyService.instanceService;
  }

  addCompany = warpAsync(
    async (
      data: CompanyAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: CompanyAddDto,
      });
      if (!validationResult.success) return validationResult;

      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const getCompany = await Company.findOne({ userId: userId }, null, {
            session,
          });
          if (getCompany)
            throw new CustomError(
              "The user already has a company.",
              "Conflict",
              false,
              409
            );

          const [newCompany] = await Company.create(
            [
              {
                ...data,
                userId: userId,
              },
            ],
            { session }
          );

          await Activity.create(
            [
              {
                userId: newCompany._id,
                ownerModel: "company",
                prefixS3: uuidv4(),
              },
            ],
            { session }
          );

          await Security.updateOne(
            { userId },
            {
              $set: {
                company: {
                  companyId: newCompany._id,
                  companyRole: "owner",
                  status: "pending",
                  memberId: "",
                },
              },
            }
          );

          await CompanySecurity.create(
            [
              {
                companyId: newCompany._id,
                legalInfo: data.legalInfo,
              },
            ],
            { session }
          );
          if (newCompany) {
            const feedBackLink = await generateLink("company/feedback");
            await Promise.all([
              FeedBack.create({
                companyId: newCompany._id,
                companyName: newCompany.companyName,
                status: "pending",
                message: sendCompanyStatusMessage(
                  newCompany.companyName,
                  "pending"
                ),
                feedBackLink: feedBackLink.link,
              }),
              await sendEmail(
                String(newCompany.companyEmail),
                "Jobliences: We've Received Your Join Request",
                sendCompanyEmail(feedBackLink.link, newCompany.companyName)
              ),
            ]);
          }
        });
        return serviceResponse({
          statusText: "Created",
          message:
            "Company created successfully. It's currently inactive and pending review. You'll receive an email update regarding the status within 2 to 7 days. You can activate it once approved.",
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

  getCompany = warpAsync(
    async (companyId: string): Promise<ServiceResponseType> => {
      const companySecurityDoc = await CompanySecurity.findOne({ companyId })
        .populate<{ companyId: CompanyDtoType }>({ path: "companyId" })
        .lean();

      let data;
      if (companySecurityDoc) {
        data = {
          ...companySecurityDoc?.companyId,
          companyId: companySecurityDoc?.companyId?._id,
          prefixS3: companySecurityDoc?.prefixS3,
          legalInfo: companySecurityDoc?.legalInfo,
          status: companySecurityDoc?.status,
          createdAt: companySecurityDoc?.createdAt,
          updatedAt: companySecurityDoc?.updatedAt,
        };
      }
      return validateAndFormatData({
        data,
        userDto: CompanyBaseDto,
      });
    }
  );

  getAllCompanies = warpAsync(
    async (
      queries: CompanyFiltersType,
      role: UserRoleType
    ): Promise<ServiceResponseType> => {
      const { status, ...filters } = generateFilters<CompanyFiltersType>(
        queries,
        role
      );
      const count = await this.countCompany(filters, role);
      return await generatePagination({
        model: CompanySecurity,
        userDto: CompanyBaseDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { status },
        populatePath: "companyId",
        populateFilter: filters,
      });
    }
  );

  countCompany = warpAsync(
    async (
      queries: CompanyFiltersType,
      role: "admin" | "manager" | "user",
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      if (filtered) {
        const filters = generateFilters<CompanyFiltersType>(queries, role);
        const pipeline = [
          {
            $match: {
              ...(filters.status && { status: filters.status }),
            },
          },
          {
            $lookup: {
              from: "company_companies",
              localField: "companyId",
              foreignField: "_id",
              as: "company",
            },
          },
          { $unwind: "$company" },
          {
            $match: {
              ...(filters.createdAt && {
                "company.createdAt": filters.createdAt,
              }),
              ...(filters.tags && {
                "company.tags": [filters.tags],
              }),
              ...(filters.companyName && {
                "company.companyName": filters.companyName,
              }),
            },
          },
          { $count: "count" },
        ];
        const result = await CompanySecurity.aggregate(pipeline);
        return serviceResponse({
          count: result[0]?.count || 0,
        });
      }
      return serviceResponse({
        count: await CompanySecurity.countDocuments(queries),
      });
    }
  );

  updateCompany = warpAsync(
    async (
      data: CompanyUpdateDtoType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: CompanyUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const [updateCompany] = await Promise.all([
        Company.updateOne(
          { _id: companyId },
          {
            $set: {
              ...data,
            },
          }
        ),
        CompanySecurity.updateOne(
          { companyId },
          {
            $set: {
              ...data,
            },
          }
        ),
      ]);

      return serviceResponse({
        data: updateCompany.modifiedCount,
      });
    }
  );

  deleteCompany = warpAsync(
    async (companyId: string): Promise<ServiceResponseType> => {
      const [deletedCount] = await Promise.all([
        CompanySecurity.deleteOne({ companyId }),
        Company.deleteOne({ _id: companyId }),
      ]);
      return serviceResponse({
        deletedCount: deletedCount.deletedCount,
      });
    }
  );
}
export default CompanyService;
