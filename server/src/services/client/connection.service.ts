import Activity from "../../models/mongodb/Analytics/activity.model";
import Connection from "../../models/mongodb/client/connection.model";
import {
  ConnectionAdminDto,
  ConnectionAddDto,
  ConnectionUpdateDto,
  ConnectionAddDtoType,
  ConnectionUpdateDtoType,
  ConnectionUserDto,
  ConnectionDtoType,
} from "../../dto/client/connection.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { CustomError } from "../../utils/customError.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generateFilters } from "../../utils/generateFilters&Sort.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { connectionStatusMapping } from "../../utils/connectionMapping.util";
import { UserRoleType } from "../../types/role.type";
import {
  ActivityConnectionType,
  ConnectionFiltersType,
} from "../../types/client.type";
import { ResponseType, ServiceResponseType } from "../../types/response.type";
import mongoose, { ClientSession } from "mongoose";

class ConnectionService {
  private static instanceService: ConnectionService;
  public static getInstance(): ConnectionService {
    if (!ConnectionService.instanceService) {
      ConnectionService.instanceService = new ConnectionService();
    }
    return ConnectionService.instanceService;
  }

  addConnection = warpAsync(
    async (
      data: ConnectionAddDtoType,
      senderId: string
    ): Promise<ServiceResponseType> => {
      const validation = this.preventToConnect(
        senderId,
        data.recipientId,
        "create"
      );
      if (!validation?.success) return validation;

      const validationResult = validateAndFormatData({
        data,
        userDto: ConnectionAddDto,
      });
      if (!validationResult.success) return validationResult;

      const existingFollow = await Connection.exists({
        $or: [
          { senderId, recipientId: data.recipientId },
          { senderId: data.recipientId, recipientId: senderId },
        ],
      });
      if (existingFollow)
        return serviceResponse({
          statusText: "Conflict",
          message: "You are already connection with this user.",
        });

      const createConnection = await Connection.create({
        ...data,
        senderId,
        history: {
          blockStatus: data.blockStatus,
          actionBy: senderId,
          actionAt: new Date(),
        },
      });

      if (createConnection)
        await this.updateActivityConnection({
          change: [1],
          fields: [data?.blockStatus == "unBlocked" ? "pending" : "blocked"],
          senderId,
          recipientId: data.recipientId,
        });

      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getConnection = warpAsync(
    async (
      data: ConnectionDtoType,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: ConnectionUserDto,
        adminDto: ConnectionAdminDto,
        viewerRole,
      });
    }
  );

  getAllConnection = warpAsync(
    async (
      queries: ConnectionFiltersType,
      userId: string,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<ConnectionFiltersType>(queries);
      const count = await this.countConnection(userId, filters, true);
      return await generatePagination({
        model: Connection,
        userDto: ConnectionUserDto,
        adminDto: ConnectionAdminDto,
        viewerRole,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: {
          $or: [{ senderId: userId }, { recipientId: userId }],
          ...filters,
        },
      });
    }
  );

  countConnection = warpAsync(
    async (
      senderId: string,
      queries: ConnectionFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<ConnectionFiltersType>(queries);
      return serviceResponse({
        count: await Connection.countDocuments({
          $or: [{ senderId }, { recipientId: senderId }],
          ...filters,
        }),
      });
    }
  );

  deleteConnection = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        deletedCount: (await Connection.deleteOne({ _id })).deletedCount,
      });
    }
  );

  updateConnection = warpAsync(
    async (
      data: ConnectionUpdateDtoType,
      _id: string,
      currUserId: string
    ): Promise<ServiceResponseType> => {
      return await mongoose.connection
        .transaction(async (session) => {
          const validationResult = validateAndFormatData({
            data,
            userDto: ConnectionUpdateDto,
            actionType: "update",
          });
          if (!validationResult.success) throw validationResult;

          const { updateFields, history } = this.buildUpdatePayload(
            validationResult.data,
            currUserId
          );

          const oldData = await Connection.findOneAndUpdate(
            { _id },
            { $set: { ...updateFields, history } },
            { new: false, session }
          ).lean();

          if (!oldData) {
            throw new CustomError(
              "Connection not found",
              "NotFound",
              false,
              409
            );
          }
          await this.executionConnectionMapping(
            oldData,
            data,
            _id,
            currUserId,
            session
          );
          return serviceResponse({ data: oldData });
        })
        .catch((err: any) => {
          if (err instanceof CustomError)
            return serviceResponse({
              statusText: err.statusText as ResponseType,
              message: err.message,
            });
          return serviceResponse({
            statusText: "InternalServerError",
            message: err.message,
          });
        });
    }
  );

  private async executionConnectionMapping(
    oldData: ConnectionDtoType,
    data: ConnectionUpdateDtoType,
    connectionId: string,
    currUserId: string,
    session: ClientSession
  ) {
    const statusKey = `${oldData.status}->${data.status}`;
    const blockKey = `${oldData.blockStatus}->${data.blockStatus}`;
    const key = connectionStatusMapping(statusKey)
      ? statusKey
      : connectionStatusMapping(blockKey)
      ? blockKey
      : null;
    if (!key) return;

    const transition = connectionStatusMapping(key);
    transition?.validateTransition?.(
      currUserId,
      oldData.history?.actionBy,
      oldData.blockStatus,
      oldData.senderId
    );
    if (
      transition?.deleteConnection ||
      (key === "blocked->unBlocked" && oldData.status === "pending")
    ) {
      await Connection.deleteOne({ _id: connectionId }, { session });
    }

    await this.updateActivityConnection({
      change: transition.updates,
      fields: transition.fields,
      senderId:
        transition.target === "actionBy"
          ? oldData.history?.actionBy
          : oldData.senderId,
      recipientId:
        transition.target === "both" ? oldData.recipientId : undefined,
      session,
    });
  }

  private buildUpdatePayload(data: ConnectionUpdateDtoType, senderId: string) {
    const history = {
      blockStatus: data.blockStatus,
      actionBy: senderId,
      actionAt: new Date(),
    };

    return {
      updateFields: {
        status: data.status,
        blockStatus: data.blockStatus,
      },
      history,
    };
  }

  private preventToConnect(
    senderId: string,
    recipientId: string,
    action: string
  ) {
    if (recipientId === senderId)
      return serviceResponse({
        statusText: "BadRequest",
        message: `Cannot ${action} connection with yourself`,
      });
    return { success: true };
  }

  private updateActivityConnection = async ({
    change,
    fields,
    senderId,
    recipientId,
    session,
  }: ActivityConnectionType) => {
    const ops: any[] = [];

    fields?.forEach((field: string, index: number) => {
      const value = change[index];
      if (field === "blocked") {
        if (senderId) {
          ops.push({
            updateOne: {
              filter: { userId: senderId },
              update: { $inc: { [`connections.${field}`]: value } },
            },
          });
        }
      } else {
        if (senderId) {
          ops.push({
            updateOne: {
              filter: { userId: senderId },
              update: { $inc: { [`connections.${field}`]: value } },
            },
          });
        }
        if (recipientId) {
          ops.push({
            updateOne: {
              filter: { userId: recipientId },
              update: { $inc: { [`connections.${field}`]: value } },
            },
          });
        }
      }
    });

    if (ops.length) {
      await Activity.bulkWrite(ops, { session });
    }
  };
}
export default ConnectionService;
