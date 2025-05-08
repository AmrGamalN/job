import JobApplication from "../../models/mongodb/jobs/JobApplication.model";
import {
  JobAppDto,
  JobAppAddDto,
  JobAppUpdateDto,
  JobAppAddDtoType,
  JobAppUpdateDtoType,
} from "../../dto/job/jobApplication.dto";
import { generatePagination } from "../../utils/generatePagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import JobAnalyticsService from "./companyJobAnalytics.service";
import { UserRequestType } from "../../types/request.type";
import { JobAppFiltersType, SortType } from "../../types/job.type";
import {
  generateFilters,
  generateSort,
} from "../../utils/generateFilters&Sort.util";

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
      data: JobAppAddDtoType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: JobAppAddDto,
      });
      if (!validationResult.success) return validationResult;

      const getJobApplication = await JobApplication.findOne({
        userId: user.userId,
        jobId: data.jobId,
      });
      if (getJobApplication)
        return serviceResponse({
          statusText: "Conflict",
          message: "The user already has a job application for this job.",
        });

      await Promise.all([
        JobApplication.create({
          ...data,
          userId: user.userId,
          applicantName: user.name,
          profileLink: user.profileLink,
        }),
        this.analyticsService.updateAnalytics(data.jobId, [
          data.applicantTypes,
          data.workplaceType,
          data.jobType,
          "created",
        ]),
      ]);

      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getJobApp = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await JobApplication.findOne({ _id }).lean(),
      userDto: JobAppUpdateDto,
    });
  });

  getAllJobApps = warpAsync(
    async (
      queries: JobAppFiltersType,
      sort: SortType,
      jobId: string
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<JobAppFiltersType>(queries);
      const count = await this.countJobApp(jobId, filters, true);
      return await generatePagination({
        model: JobApplication,
        userDto: JobAppDto,
        totalCount: count.count,
        paginationOptions: {
          sort: generateSort<SortType>(sort),
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { jobId, ...filters },
      });
    }
  );

  countJobApp = warpAsync(
    async (
      jobId: string,
      queries: JobAppFiltersType,
      filtered: boolean
    ): Promise<ServiceResponseType> => {
      const filterResult = filtered
        ? queries
        : generateFilters<JobAppFiltersType>(queries);
      return serviceResponse({
        count: await JobApplication.countDocuments({
          jobId,
          ...filterResult,
        }),
      });
    }
  );

  updateJobApp = warpAsync(
    async (
      data: JobAppUpdateDtoType,
      jobAppId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: JobAppUpdateDto,
        actionType: "update",
      });
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
      );

      if (updateJobApplication) {
        const fieldsToTrack: (keyof typeof data)[] = [
          "applicantTypes",
          "workplaceType",
          "jobType",
        ];

        const { oldValues, newValues } = this.extractChangedValues(
          updateJobApplication,
          data,
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
}

export default JobAppService;
