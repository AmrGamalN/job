import Job from "../../models/mongodb/jobs/job.model";
import {
  JobDto,
  JobAddDto,
  JobUpdateDto,
  JobAddDtoType,
  JobUpdateDtoType,
} from "../../dto/job/job.dto";
import { paginate } from "../../utils/pagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import { JobFiltersType, JobSortType } from "../../types/job.type";
import JobAnalyticsService from "./companyJobAnalytics.service";
import { generateLink } from "../../utils/generateUniqueLink.util";

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
      jobData: JobAddDtoType,
      companyId: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(jobData, JobAddDto);
      if (!validationResult.success) return validationResult;
      const jobLink = await generateLink("company/job");
      const createJob = await Job.create({
        ...jobData,
        companyId,
        createdBy: userId,
        jobLink: jobLink?.link,
      });

      const field = [
        ...jobData.applicantTypes,
        ...jobData.workplaceType,
        ...jobData.jobType,
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
        jobData.expireAt,
        field
      );

      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getJob = warpAsync(async (jobId: string): Promise<ServiceResponseType> => {
    const getJob = await Job.findOne({ _id: jobId }).lean();
    return validateAndFormatData(getJob, JobDto);
  });

  getAllJobs = warpAsync(
    async (
      filters: JobFiltersType,
      sort: JobSortType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const count = await this.countJob(companyId, filters);
      return await paginate(
        Job,
        JobDto,
        count.count ?? 0,
        {
          sort: this.sortJobs(sort),
          page: filters.page,
          limit: filters.limit,
        },
        null,
        { companyId, ...this.filterJobs(filters) }
      );
    }
  );

  countJob = warpAsync(
    async (
      companyId: string,
      filters: JobFiltersType
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Job.countDocuments({
          companyId,
          ...this.filterJobs(filters),
        }),
      });
    }
  );

  updateJob = warpAsync(
    async (
      JobData: JobUpdateDtoType,
      jobId: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        JobData,
        JobUpdateDto,
        "update"
      );
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

  private filterJobs = (queries: JobFiltersType) => {
    const filtersOption: (keyof typeof queries)[] = [
      "department",
      "location",
      "skills",
      "jobExperience",
      "applicantTypes",
      "workplaceType",
      "jobTitle",
      "jobType",
    ];
    let filters: Record<string, string | object> = {};

    if (queries.start && queries.end) {
      filters["createdAt"] = { $gte: queries.start, $lte: queries.end };
    }

    if (queries.salaryMin && queries.salaryMax) {
      filters["salary.min"] = {
        $gte: queries.salaryMin,
      };
      filters["salary.max"] = {
        $lte: queries.salaryMax,
      };
    }

    for (const key of filtersOption) {
      if (queries[key] && typeof queries[key] == "string")
        filters[key] = queries[key];
    }
    return filters;
  };

  private sortJobs = (queries: JobSortType) => {
    const sort: Record<string, number> = {};
    if (queries.createdAt) sort["createdAt"] = Number(queries.createdAt);
    if (queries.salary) sort["salary"] = Number(queries.salary);
    if (queries.views) sort["viewsCount"] = Number(queries.views);
    return sort;
  };
}

export default JobService;
