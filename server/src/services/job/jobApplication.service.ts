import JobApplication from "../../models/mongodb/jobs/JobApplication.model";
import {
  JobAppDto,
  JobAppAddDto,
  JobAppUpdateDto,
  JobAppAddDtoType,
  JobAppUpdateDtoType,
} from "../../dto/job/jobApplication.dto";
import { paginate } from "../../utils/pagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import JobAnalyticsService from "./companyJobAnalytics.service";
import { UserRequestType } from "../../types/request.type";
import { JobAppFiltersType, SortType } from "../../types/job.type";

class JobAppService {
  private static instanceService: JobAppService;
  private analyticsService: JobAnalyticsService;
  private constructor() {
    this.analyticsService = JobAnalyticsService.getInstance();
  }
  public static getInstance(): JobAppService {
    if (!JobAppService.instanceService) {
      JobAppService.instanceService = new JobAppService();
    }
    return JobAppService.instanceService;
  }

  addJobApp = warpAsync(
    async (
      jobData: JobAppAddDtoType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(jobData, JobAppAddDto);
      if (!validationResult.success) return validationResult;

      const getJobApplication = await JobApplication.findOne({
        userId: user.userId,
        jobId: jobData.jobId,
      });
      if (getJobApplication)
        return serviceResponse({
          statusText: "Conflict",
          message: "The user already has a job application for this job.",
        });

      await Promise.all([
        JobApplication.create({
          ...jobData,
          userId: user.userId,
          applicantName: user.name,
          profileLink: user.profileLink,
        }),
        this.analyticsService.updateAnalytics(jobData.jobId, [
          jobData.applicantTypes,
          jobData.workplaceType,
          jobData.jobType,
          "created",
        ]),
      ]);

      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getJobApp = warpAsync(
    async (jobAppId: string): Promise<ServiceResponseType> => {
      const getJobApp = await JobApplication.findOne({ _id: jobAppId }).lean();
      return validateAndFormatData(getJobApp, JobAppDto);
    }
  );

  getAllJobApps = warpAsync(
    async (
      filters: JobAppFiltersType,
      sort: SortType,
      jobId: string
    ): Promise<ServiceResponseType> => {
      const count = await this.countJobApp(filters, jobId);
      return await paginate(
        JobApplication,
        JobAppDto,
        count.count ?? 0,
        {
          sort: this.sortJobApps(sort),
          page: filters.page,
          limit: filters.limit,
        },
        null,
        { jobId, ...this.filterJobApp(filters) }
      );
    }
  );

  countJobApp = warpAsync(
    async (
      filters: JobAppFiltersType,
      jobId: string
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await JobApplication.countDocuments({
          jobId,
          ...this.filterJobApp(filters),
        }),
      });
    }
  );

  updateJobApp = warpAsync(
    async (
      jobAppData: JobAppUpdateDtoType,
      jobAppId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        jobAppData,
        JobAppUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateJobApplication = await JobApplication.findOneAndUpdate(
        {
          _id: jobAppId,
        },
        {
          $set: {
            ...validationResult.data,
          },
        }
      ).lean();

      if (updateJobApplication) {
        const fieldsToTrack: (keyof typeof jobAppData)[] = [
          "applicantTypes",
          "workplaceType",
          "jobType",
        ];

        const { oldValues, newValues } = this.extractChangedValues(
          updateJobApplication,
          jobAppData,
          fieldsToTrack
        );

        if (newValues.length || oldValues.length) {
          this.analyticsService.updateAnalytics(
            updateJobApplication.jobId,
            newValues,
            oldValues
          );
        }
      }

      return serviceResponse({
        data: updateJobApplication,
      });
    }
  );

  deleteJobApp = warpAsync(
    async (jobAppId: string): Promise<ServiceResponseType> => {
      const deleteJobApp = await JobApplication.findOneAndDelete({
        _id: jobAppId,
      });

      if (deleteJobApp) {
        this.analyticsService.updateAnalytics(
          deleteJobApp.jobId,
          [],
          [
            deleteJobApp.applicantTypes,
            deleteJobApp.workplaceType,
            deleteJobApp.jobType,
            "create",
          ]
        );
      }
      return serviceResponse({
        data: deleteJobApp ? [] : null,
      });
    }
  );

  private extractChangedValues(
    oldData: any,
    newData: any,
    fields: any
  ): { oldValues: string[]; newValues: string[] } {
    const oldValues: string[] = [];
    const newValues: string[] = [];

    for (const field of fields) {
      const oldValue = oldData[field];
      const newValue = newData[field];

      if (oldValue !== newValue) {
        oldValues.push(oldValue);
        newValues.push(newValue);
      }
    }
    return { oldValues, newValues };
  }

  private filterJobApp = (queries: JobAppFiltersType) => {
    const filtersOption: (keyof typeof queries)[] = [
      "currentAddress",
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

    for (const key of filtersOption) {
      if (queries[key] && typeof queries[key] == "string")
        filters[key] = queries[key];
    }
    return filters;
  };

  private sortJobApps = (queries: SortType) => {
    const sort: Record<string, number> = {};
    if (queries.createdAt) sort["createdAt"] = Number(queries.createdAt);
    return sort;
  };
}

export default JobAppService;
