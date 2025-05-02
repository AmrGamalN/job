import Interview from "../../models/mongodb/jobs/interview.model";
import {
  InterviewDto,
  InterviewAddDto,
  InterviewUpdateDto,
  InterviewAddDtoType,
  InterviewUpdateDtoType,
} from "../../dto/job/interview.dto";
import { paginate } from "../../utils/pagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ResponseType, ServiceResponseType } from "../../types/response.type";
import { InterviewFiltersType, SortType } from "../../types/job.type";
import JobAnalyticsService from "./companyJobAnalytics.service";
import { generateLink } from "../../utils/generateUniqueLink.util";
import { sendEmail } from "../../utils/sendEmail.util";
import { sendInterviewEmail } from "../../utils/emailMessage.util";
import JobApplication from "../../models/mongodb/jobs/JobApplication.model";
import { CustomError } from "../../utils/customError.util";
import mongoose from "mongoose";
import { UserRequestType } from "../../types/request.type";

class InterviewService {
  private static instanceService: InterviewService;
  private analyticsService: JobAnalyticsService;
  private constructor() {
    this.analyticsService = JobAnalyticsService.getInstance();
  }
  public static getInstance(): InterviewService {
    if (!InterviewService.instanceService) {
      InterviewService.instanceService = new InterviewService();
    }
    return InterviewService.instanceService;
  }

  addInterview = warpAsync(
    async (
      interviewData: InterviewAddDtoType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        interviewData,
        InterviewAddDto
      );
      if (!validationResult.success) return validationResult;

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const isExistingInterview = await Interview.findOne({
          jobApplicationId: interviewData.jobApplicationId,
          userId: interviewData.userId,
        }).session(session);
        if (isExistingInterview)
          throw new CustomError(
            "Interview already to this user.",
            "Conflict",
            false,
            409
          );

        const jobApplication = await JobApplication.findById(
          interviewData.jobApplicationId
        ).session(session);
        if (!jobApplication)
          throw new CustomError(
            "Job application not found.",
            "NotFound",
            false,
            404
          );

        const interviewLink = await generateLink("company/job/interview/link");
        if (!interviewLink?.link)
          throw new CustomError(
            "Failed to generate interview link, please try again.",
            "BadRequest",
            false,
            409
          );

        const [createInterview] = await Interview.create(
          [
            {
              ...interviewData,
              companyId: jobApplication.companyId,
              jobId: jobApplication.jobId,
              interviewLink: interviewLink.link,
              createdBy: user.userId,
            },
          ],
          { session }
        );

        if (createInterview) {
          const [resultEmail] = await Promise.all([
            sendEmail(
              jobApplication.email,
              "Jobliences: Your Interview Invitation",
              sendInterviewEmail(
                interviewLink.link,
                jobApplication.applicantName
              )
            ),
            this.analyticsService.updateAnalytics(jobApplication.jobId, [
              interviewData.interviewResult,
              interviewData.interviewStatus,
              "Interviewed",
            ]),
          ]);
          if (!resultEmail.success) {
            throw new CustomError(
              "Failed to send email, Please try again.",
              "BadRequest",
              false,
              400
            );
          }
        }

        await session.commitTransaction();
        return serviceResponse({
          statusText: "Created",
          message: "Interview created and email sent to applicant successfully",
        });
      } catch (err: any) {
        await session.abortTransaction();
        if (err instanceof CustomError)
          return serviceResponse({
            statusText: err.statusText as ResponseType,
            message: err.message,
          });

        return serviceResponse({
          statusText: "InternalServerError",
          message: `Failed to create interview: ${err.message}`,
        });
      } finally {
        await session.endSession();
      }
    }
  );

  getInterview = warpAsync(
    async (interviewId: string): Promise<ServiceResponseType> => {
      const getInterview = await Interview.findById({
        _id: interviewId,
      }).lean();
      return validateAndFormatData(getInterview, InterviewDto);
    }
  );

  getAllInterviews = warpAsync(
    async (
      filters: InterviewFiltersType,
      sort: SortType,
      jobId: string
    ): Promise<ServiceResponseType> => {
      const count = await this.countInterview(filters, jobId);
      return await paginate(
        Interview,
        InterviewDto,
        count.count ?? 0,
        {
          sort: this.sortInterviews(sort),
          page: filters.page,
          limit: filters.limit,
        },
        null,
        { jobId, ...this.filterInterviews(filters) }
      );
    }
  );

  getInterviewByLink = warpAsync(
    async (link: string): Promise<ServiceResponseType> => {
      if (link.split("/")[9]?.length != 70) {
        return serviceResponse({
          statusText: "NotFound",
        });
      }
      const getInterview = await Interview.findOne({
        interviewLink: link,
      }).lean();
      return validateAndFormatData(getInterview, InterviewDto);
    }
  );

  countInterview = warpAsync(
    async (
      filters: InterviewFiltersType,
      jobId
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Interview.countDocuments({
          ...this.filterInterviews(filters),
          jobId,
        }),
      });
    }
  );

  updateInterview = warpAsync(
    async (
      InterviewData: InterviewUpdateDtoType,
      interviewId: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        InterviewData,
        InterviewUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateInterview = await Interview.findOneAndUpdate(
        {
          _id: interviewId,
        },
        {
          $set: {
            ...validationResult.data,
            updatedBy: userId,
          },
        }
      ).lean();
      if (updateInterview) {
        const fieldsToTrack: (keyof typeof InterviewData)[] = [
          "interviewResult",
          "interviewStatus",
        ];

        const { oldValues, newValues } = this.extractChangedValues(
          updateInterview,
          InterviewData,
          fieldsToTrack
        );
        if (newValues.length || oldValues.length) {
          this.analyticsService.updateAnalytics(
            updateInterview.jobId,
            newValues,
            oldValues
          );
        }
      }
      return serviceResponse({
        data: updateInterview,
      });
    }
  );

  deleteInterview = warpAsync(
    async (interviewId: string): Promise<ServiceResponseType> => {
      const deleteInterview = await Interview.findOneAndDelete({
        _id: interviewId,
      });
      if (deleteInterview) {
        this.analyticsService.updateAnalytics(
          deleteInterview.jobId,
          [],
          [
            deleteInterview.interviewResult,
            deleteInterview.interviewStatus,
            "Interviewed",
          ]
        );
      }
      return serviceResponse({
        data: deleteInterview ? [] : null,
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

  private filterInterviews = (queries: InterviewFiltersType) => {
    const filtersOption: (keyof typeof queries)[] = [
      "interviewStatus",
      "interviewResult",
      "interviewPlatform",
    ];
    let filters: Record<string, string | object> = {};

    if (queries.start && queries.end) {
      filters["createdAt"] = { $gte: queries.start, $lte: queries.end };
    }

    for (const key of filtersOption) {
      if (queries[key] && typeof queries[key] == "string")
        filters[key] = queries[key];
    }
    console.log(filters);
    return filters;
  };

  private sortInterviews = (queries: SortType) => {
    const sort: Record<string, number> = {};
    if (queries.createdAt) sort["createdAt"] = Number(queries.createdAt);
    return sort;
  };
}

export default InterviewService;
