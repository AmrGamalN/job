import mongoose from "mongoose";
import Member from "../../models/mongodb/company/member.model";
import Security from "../../models/mongodb/profiles/security.model";
import {
  MemberDto,
  MemberAddDto,
  MemberUpdateDto,
  MemberAddDtoType,
  MemberUpdateDtoType,
} from "../../dto/company/member.dto";
import { paginate } from "../../utils/pagination.util";
import { sendEmail } from "../../utils/sendEmail.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { CustomError } from "../../utils/customErr.util";
import { serviceResponse } from "../../utils/response.util";
import { sendMemberEmail } from "../../utils/emailMessage.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { MemberFiltersType } from "../../types/company.type";
import { ServiceResponseType, ResponseType } from "../../types/response.type";

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
      memberData: MemberAddDtoType,
      adminId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(memberData, MemberAddDto);
      if (!validationResult.success) return validationResult;

      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const [existingMember, existingUser] = await Promise.all([
            Member.findOne({ userId: memberData.userId, companyId }, null, {
              session,
            }),
            Security.findOne({ userId: memberData.userId }, null, {
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
                ...memberData,
                addedBy: adminId,
              },
            ],
            { session }
          );

          await Security.updateOne(
            { userId: memberData.userId },
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
            String(memberData.email),
            "Jobliences: We've Received Your Join Request",
            sendMemberEmail(memberData.name)
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

  getMember = warpAsync(
    async (memberId: string): Promise<ServiceResponseType> => {
      const getMember = await Member.findOne({
        _id: memberId,
      }).lean();
      return validateAndFormatData(getMember, MemberDto);
    }
  );

  getAllMembers = warpAsync(
    async (
      filters: MemberFiltersType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const count = await this.countMember(filters, companyId);
      return await paginate(
        Member,
        MemberDto,
        count.count ?? 0,
        {
          page: filters.page,
          limit: filters.limit,
        },
        null,
        { companyId, ...this.filerMembers(filters) }
      );
    }
  );

  countMember = warpAsync(
    async (
      filters: MemberFiltersType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Member.countDocuments({
          companyId,
          ...this.filerMembers(filters),
        }),
      });
    }
  );

  updateMember = warpAsync(
    async (
      MemberData: MemberUpdateDtoType,
      memberId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        MemberData,
        MemberUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateMember = await Member.findOneAndUpdate(
        { _id: memberId },
        {
          $set: {
            ...validationResult.data,
          },
        }
      ).lean();

      if (!updateMember) {
        return serviceResponse({
          statusText: "NotFound",
          message: "Member not found",
        });
      }

      let message;
      if (MemberData.status !== updateMember.status) {
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
    async (memberId: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Member.deleteOne({ _id: memberId })).deletedCount,
      });
    }
  );

  private filerMembers = (queries: MemberFiltersType): object => {
    let filters: Record<string, string | object> = {};
    const filtersOption: (keyof typeof queries)[] = [
      "role",
      "name",
      "status",
      "position",
      "department",
    ];

    if (queries.start && queries.end) {
      filters["createdAt"] = { $gte: queries.start, $lte: queries.end };
    }

    for (const key of filtersOption) {
      if (queries[key] && typeof queries[key] == "string")
        filters[key] = queries[key];
    }
    return filters;
  };
}

export default MemberService;
