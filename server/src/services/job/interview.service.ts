import Interview from "../../models/mongodb/jobs/interview.model";
import {
  InterviewDto,
  InterviewAddDto,
  InterviewUpdateDto,
  InterviewAddDtoType,
  InterviewUpdateDtoType,
} from "../../dto/job/interview.dto";
import { generatePagination } from "../../utils/generatePagination.util";
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
import {
  generateFilters,
  generateSort,
} from "../../utils/generateFilters&Sort.util";

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
      data: InterviewAddDtoType,
      user: UserRequestType
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: InterviewAddDto,
      });
      if (!validationResult.success) return validationResult;

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const isExistingInterview = await Interview.findOne({
          jobApplicationId: data.jobApplicationId,
          userId: data.userId,
        }).session(session);
        if (isExistingInterview)
          throw new CustomError(
            "Interview already to this user.",
            "Conflict",
            false,
            409
          );

        const jobApplication = await JobApplication.findById(
          data.jobApplicationId
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
              ...data,
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
              data.interviewResult,
              data.interviewStatus,
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
    async (_id: string): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data: await Interview.findById({ _id }).lean(),
        userDto: InterviewDto,
      });
    }
  );

  getAllInterviews = warpAsync(
    async (
      queries: InterviewFiltersType,
      sort: SortType,
      jobId: string
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<InterviewFiltersType>(queries);
      const count = await this.countInterview(jobId, filters, true);
      return await generatePagination({
        model: Interview,
        userDto: InterviewDto,
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

  countInterview = warpAsync(
    async (
      jobId,
      queries: InterviewFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<InterviewFiltersType>(queries);
      return serviceResponse({
        count: await Interview.countDocuments({
          jobId,
          ...filters,
        }),
      });
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
      return validateAndFormatData({
        data: getInterview,
        userDto: InterviewDto,
      });
    }
  );

  updateInterview = warpAsync(
    async (
      data: InterviewUpdateDtoType,
      interviewId: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: InterviewUpdateDto,
        actionType: "update",
      });
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
      );
      if (updateInterview) {
        const fieldsToTrack: (keyof typeof data)[] = [
          "interviewResult",
          "interviewStatus",
        ];

        const { oldValues, newValues } = this.extractChangedValues(
          updateInterview,
          data,
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
}

export default InterviewService;
