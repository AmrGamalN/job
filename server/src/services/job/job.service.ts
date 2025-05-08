import Job from "../../models/mongodb/jobs/job.model";
import {
  JobDto,
  JobAddDto,
  JobUpdateDto,
  JobAddDtoType,
  JobUpdateDtoType,
} from "../../dto/job/job.dto";
import { generatePagination } from "../../utils/generatePagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import { JobFiltersType, JobSortType } from "../../types/job.type";
import JobAnalyticsService from "./companyJobAnalytics.service";
import { generateLink } from "../../utils/generateUniqueLink.util";
import {
  generateSort,
  generateFilters,
} from "../../utils/generateFilters&Sort.util";

class JobService {
  private static instanceService: JobService;
  private analyticsService: JobAnalyticsService;
  private constructor() {
    this.analyticsService = JobAnalyticsService.getInstance();
  }
  public static getInstance(): JobService {
    if (!JobService.instanceService) {
      JobService.instanceService = new JobService();
    }
    return JobService.instanceService;
  }

  addJob = warpAsync(
    async (
      data: JobAddDtoType,
      companyId: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: JobAddDto,
      });
      if (!validationResult.success) return validationResult;

      const jobLink = await generateLink("company/job");
      const createJob = await Job.create({
        ...data,
        companyId,
        createdBy: userId,
        jobLink: jobLink?.link,
      });

      const field = [
        ...data.applicantTypes,
        ...data.workplaceType,
        ...data.jobType,
        ...[
          "create",
          "interest",
          "view",
          "passed",
          "pending",
          "reject",
          "shortlist",
          "hired",
        ],
      ];
      this.analyticsService.createAnalytics(
        String(createJob._id),
        data.expireAt,
        field
      );

      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getJob = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await Job.findById({ _id }).lean(),
      userDto: JobDto,
    });
  });

  getAllJobs = warpAsync(
    async (
      queries: JobFiltersType,
      sort: JobSortType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<JobFiltersType>(queries);
      const count = await this.countJob(companyId, filters, true);
      return await generatePagination({
        model: Job,
        userDto: JobDto,
        totalCount: count.count,
        paginationOptions: {
          sort: generateSort<JobSortType>(sort),
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { companyId, ...filters },
      });
    }
  );

  countJob = warpAsync(
    async (
      jobId: string,
      queries: JobFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<JobFiltersType>(queries);
      return serviceResponse({
        count: await Job.countDocuments({
          jobId,
          ...filters,
        }),
      });
    }
  );

  updateJob = warpAsync(
    async (
      data: JobUpdateDtoType,
      jobId: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: JobUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateJob = await Job.updateOne(
        {
          _id: jobId,
        },
        {
          $set: {
            ...validationResult.data,
            updatedBy: userId,
          },
        }
      ).lean();
      return serviceResponse({
        data: updateJob.modifiedCount,
      });
    }
  );

  deleteJob = warpAsync(async (jobId: string): Promise<ServiceResponseType> => {
    const [deleteResult] = await Promise.all([
      Job.deleteOne({ _id: jobId }),
      this.analyticsService.deleteAnalytics(jobId),
    ]);
    return serviceResponse({
      deletedCount: deleteResult.deletedCount,
    });
  });
}

export default JobService;
