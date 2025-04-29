import Company from "../../models/mongodb/company/company.model";
import FeedBack from "../../models/mongodb/company/feedBack.model";
import Security from "../../models/mongodb/profiles/security.model";
import Activity from "../../models/mongodb/Analytics/activity.model";
import Interest from "../../models/mongodb/profiles/interest.model";
import CompanySecurity from "../../models/mongodb/company/security.model";
import {
  CompanyBaseDto,
  CompanyAddDto,
  CompanyUpdateDto,
  CompanyAddDtoType,
  CompanyUpdateDtoType,
} from "../../dto/company/security.dto";
import { CompanyDtoType } from "../../dto/company/company.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { paginate } from "../../utils/pagination.util";
import { sendEmail } from "../../utils/sendEmail.util";
import { serviceResponse } from "../../utils/response.util";
import { generateFeedbackLink } from "../../utils/generateUniqueLink.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { CustomError } from "../../utils/customErr.util";
import {
  sendCompanyEmail,
  sendCompanyStatusMessage,
} from "../../utils/emailMessage.util";
import { ServiceResponseType, ResponseType } from "../../types/response.type";
import {
  CompanyFiltersType,
  CompanyStatusType,
} from "../../types/company.type";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

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
      CompanyData: CompanyAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        CompanyData,
        CompanyAddDto
      );
      if (!validationResult.success) return validationResult;

      const session = await mongoose.startSession();
      try {
        const prefixS3 = uuidv4();
        await session.withTransaction(async () => {
          const getCompany = await Company.findOne({ ownerId: userId }, null, {
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
                ...CompanyData,
                ownerId: userId,
              },
            ],
            { session }
          );

          await Activity.create(
            [
              {
                ownerId: newCompany._id,
                ownerModel: "company",
                prefixS3,
              },
            ],
            { session }
          );

          await Interest.create(
            [{ ownerId: newCompany._id, ownerModel: "company" }],
            {
              session,
            }
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
                legalInfo: CompanyData.legalInfo,
              },
            ],
            { session }
          );
          if (newCompany) {
            const feedBackLink = await generateFeedbackLink(
              newCompany.companyName.replace(/ /g, "_")
            );

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
              sendEmail(
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

      let mergedCompanyData;
      if (companySecurityDoc) {
        mergedCompanyData = {
          ...companySecurityDoc?.companyId,
          companyId: companySecurityDoc?.companyId?._id,
          prefixS3: companySecurityDoc?.prefixS3,
          legalInfo: companySecurityDoc?.legalInfo,
          status: companySecurityDoc?.status,
          createdAt: companySecurityDoc?.createdAt,
          updatedAt: companySecurityDoc?.updatedAt,
        };
      }
      return validateAndFormatData(mergedCompanyData, CompanyBaseDto);
    }
  );

  getAllCompanies = warpAsync(
    async (
      queries: CompanyFiltersType,
      role: "admin" | "manager" | "user"
    ): Promise<ServiceResponseType> => {
      const count = await this.countCompany(queries, role);
      const { status, ...filters } = this.filterCompanies(queries, role);
      return await paginate(
        CompanySecurity,
        CompanyBaseDto,
        count.count ?? 0,
        { page: queries.page, limit: queries.limit },
        null,
        status,
        "companyId",
        filters
      );
    }
  );

  updateCompany = warpAsync(
    async (
      companyData: CompanyUpdateDtoType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        companyData,
        CompanyUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const [updateCompany] = await Promise.all([
        Company.updateOne(
          { _id: companyId },
          {
            $set: {
              ...companyData,
            },
          }
        ),
        CompanySecurity.updateOne(
          { companyId },
          {
            $set: {
              ...companyData,
            },
          }
        ),
      ]);

      return serviceResponse({
        data: updateCompany.modifiedCount,
      });
    }
  );

  countCompany = warpAsync(
    async (
      queries: CompanyFiltersType,
      role: "admin" | "manager" | "user"
    ): Promise<ServiceResponseType> => {
      const filters = this.filterCompanies(queries, role);
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
  );

  deleteCompany = warpAsync(
    async (companyId: string): Promise<ServiceResponseType> => {
      const [deletedCount] = await Promise.all([
        CompanySecurity.deleteOne({ companyId }),
        Company.deleteOne({ _id: companyId }),
      ]);
      return serviceResponse({
        deleteCount: deletedCount.deletedCount,
      });
    }
  );

  private filterCompanies = (
    queries: CompanyFiltersType,
    role: "admin" | "manager" | "user"
  ): any => {
    let filtersOption: (keyof typeof queries)[] = ["companyName"];
    let filters: Record<string, string | object> = {};

    if (role === "admin" || role === "manager") {
      if (queries.status) filters["status"] = queries.status;
      if (queries.start && queries.end) {
        filters["createdAt"] = { $gte: queries.start, $lte: queries.end };
      }
    }

    if (role == "user") {
      filters["status"] = { status: "active" };
    }

    if (queries.tags) {
      filters["tags"] = { $in: [queries.tags] };
    }

    for (const key of filtersOption) {
      if (queries[key] && typeof queries[key] == "string")
        filters[key] = queries[key];
    }
    return filters;
  };
}
export default CompanyService;
