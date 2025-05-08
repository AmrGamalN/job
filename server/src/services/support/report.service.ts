import Report from "../../models/mongodb/support/report.model";
import {
  ReportDto,
  ReportAddDtoType,
  ReportAddDto,
  ReportUpdateDtoType,
  ReportUpdateDto,
} from "../../dto/support/report.dto";
import { generatePagination } from "../../utils/generatePagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import { ReportFiltersType } from "../../types/support.type";
import { generateFilters } from "../../utils/generateFilters&Sort.util";

class ReportService {
  private static instanceService: ReportService;
  public static getInstance(): ReportService {
    if (!ReportService.instanceService) {
      ReportService.instanceService = new ReportService();
    }
    return ReportService.instanceService;
  }

  addReport = warpAsync(
    async (
      data: ReportAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: ReportAddDto,
      });
      if (!validationResult.success) return validationResult;

      const existingReport = await Report.findOne({
        userId: userId,
        targetId: data.targetId,
      }).lean();
      if (existingReport)
        return serviceResponse({
          statusText: "Conflict",
          message: "This report already exists",
        });

      if (userId == data.targetId)
        return serviceResponse({
          statusText: "Conflict",
          message: "You cannot report yourself",
        });

      await Report.create({
        ...data,
        userId,
      });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getReport = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await Report.findById({ _id }).lean(),
      userDto: ReportDto,
    });
  });

  getAllReports = warpAsync(
    async (
      queries: ReportFiltersType,
      userId: string,
      role: string
    ): Promise<ServiceResponseType> => {
      const id = role === "admin" || role === "manager" ? null : { userId };
      const filters = generateFilters<ReportFiltersType>(queries);
      const count = await this.countReport(id, filters, true);
      return await generatePagination({
        model: Report,
        userDto: ReportDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { ...id, ...filters },
      });
    }
  );

  countReport = warpAsync(
    async (
      userId: object,
      queries: ReportFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<ReportFiltersType>(queries);
      return serviceResponse({
        count: await Report.countDocuments({ ...userId, ...filters }),
      });
    }
  );

  updateReport = warpAsync(
    async (
      data: ReportUpdateDtoType,
      _id: string,
      reviewedBy: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: ReportUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateReport = await Report.updateOne(
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
        data: updateReport,
      });
    }
  );

  deleteReport = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Report.deleteOne({ _id })).deletedCount,
      });
    }
  );
}

export default ReportService;
