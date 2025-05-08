import mongoose from "mongoose";
import Member from "../../models/mongodb/company/member.model";
import Security from "../../models/mongodb/client/security.model";
import {
  MemberDto,
  MemberAddDto,
  MemberUpdateDto,
  MemberAddDtoType,
  MemberUpdateDtoType,
} from "../../dto/company/member.dto";
import { generatePagination } from "../../utils/generatePagination.util";
import { sendEmail } from "../../utils/sendEmail.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { CustomError } from "../../utils/customError.util";
import { serviceResponse } from "../../utils/response.util";
import { sendMemberEmail } from "../../utils/emailMessage.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { MemberFiltersType } from "../../types/company.type";
import { ServiceResponseType, ResponseType } from "../../types/response.type";
import { generateFilters } from "../../utils/generateFilters&Sort.util";

class MemberService {
  private static instanceService: MemberService;
  public static getInstance(): MemberService {
    if (!MemberService.instanceService) {
      MemberService.instanceService = new MemberService();
    }
    return MemberService.instanceService;
  }

  addMember = warpAsync(
    async (
      data: MemberAddDtoType,
      adminId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: MemberAddDto,
      });
      if (!validationResult.success) return validationResult;

      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const [existingMember, existingUser] = await Promise.all([
            Member.findOne({ userId: data.userId, companyId }, null, {
              session,
            }),
            Security.findOne({ userId: data.userId }, null, {
              session,
            }),
          ]);

          if (!existingUser)
            throw new CustomError("User not found", "NotFound", false, 404);

          if (existingMember)
            throw new CustomError(
              "Member already exists",
              "Conflict",
              false,
              409
            );

          const [createdMember] = await Member.create(
            [
              {
                ...data,
                addedBy: adminId,
              },
            ],
            { session }
          );

          await Security.updateOne(
            { userId: data.userId },
            {
              $set: {
                company: {
                  companyId: createdMember.companyId,
                  role: createdMember.role,
                  memberId: createdMember._id,
                },
              },
            },
            { session }
          );

          const resultEmail = await sendEmail(
            String(data.email),
            "Jobliences: We've Received Your Join Request",
            sendMemberEmail(data.name)
          );

          if (!resultEmail.success)
            throw new CustomError(
              "Failed to send email",
              "InternalServerError",
              false,
              500
            );
        });

        return serviceResponse({
          statusText: "Created",
          message: "Member created successfully and email sent",
        });
      } catch (err: any) {
        if (err instanceof CustomError) {
          return serviceResponse({
            statusText: err.statusText as ResponseType,
            message: err.message,
          });
        }
        return serviceResponse({
          statusText: "InternalServerError",
          message: "Something went wrong. Please try again later.",
        });
      } finally {
        await session.endSession();
      }
    }
  );

  getMember = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    const getMember = await Member.findById({ _id }).lean();
    return validateAndFormatData({
      data: getMember,
      userDto: MemberDto,
    });
  });

  getAllMembers = warpAsync(
    async (
      queries: MemberFiltersType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<MemberFiltersType>(queries);
      const count = await this.countMember(filters, companyId, true);
      return await generatePagination({
        model: Member,
        userDto: MemberDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { companyId, ...filters },
      });
    }
  );

  countMember = warpAsync(
    async (
      queries: MemberFiltersType,
      companyId: string,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<MemberFiltersType>(queries);
      return serviceResponse({
        count: await Member.countDocuments({
          companyId,
          ...filters,
        }),
      });
    }
  );

  updateMember = warpAsync(
    async (
      data: MemberUpdateDtoType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: MemberUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateMember = await Member.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...validationResult.data,
          },
        }
      );

      if (!updateMember) {
        return serviceResponse({
          statusText: "NotFound",
          message: "Member not found",
        });
      }

      let message;
      if (data.status !== updateMember.status) {
        message = `Your Join Request Status Changed to ${updateMember.status}, and send email to ${updateMember.email}`;
        const resultEmail = await sendEmail(
          updateMember.email!,
          "Jobliences: Your Join Request Status Changed",
          sendMemberEmail(String(updateMember.name))
        );
        if (!resultEmail.success) return resultEmail;
      }

      return serviceResponse({
        message: message,
        data: updateMember,
      });
    }
  );

  deleteMember = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Member.deleteOne({ _id })).deletedCount,
      });
    }
  );
}

export default MemberService;
