import Connection from "../../models/mongodb/profiles/connection.model";
import {
  ConnectionDto,
  ConnectionAddDto,
  ConnectionUpdateDto,
  ConnectionAddDtoType,
  ConnectionUpdateDtoType,
} from "../../dto/profiles/connection.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { validateAndFormatData } from "../../utils/validateData.util";
import { paginate } from "../../utils/pagination.util";
import Security from "../../models/mongodb/profiles/security.model";

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
      targetUid: ConnectionAddDtoType,
      ownerId: string
    ): Promise<ServiceResponseType> => {
      const validation = this.preventToConnect(ownerId, targetUid.userId);
      if (!validation?.success) return validation;

      const validationResult = validateAndFormatData(
        targetUid,
        ConnectionAddDto
      );
      if (!validationResult.success) return validationResult;

      const [getUser, getConnection] = await Promise.all([
        Security.findOne({ ownerId: targetUid.userId }).lean(),
        Connection.findOne({
          $or: [
            { ownerId, connectorId: targetUid.userId },
            { ownerId: targetUid.userId, connectorId: ownerId },
          ],
        }).lean(),
      ]);
      if (!getUser) {
        return serviceResponse({
          statusText: "NotFound",
          message: "User not found",
        });
      }
      if (getConnection)
        return serviceResponse({
          statusText: "Conflict",
          message: "Connection already exist",
        });
      await Connection.create({
        connectorId: targetUid.userId,
        ownerId,
        ownerType: targetUid.ownerType,
      });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getConnection = warpAsync(
    async (
      ownerId: string,
      targetUid: string,
      ownerType: string
    ): Promise<ServiceResponseType> => {
      const validation = this.preventToConnect(ownerId, targetUid);
      if (!validation?.success) return validation;

      const getConnection = await Connection.findOne({
        $or: [
          { ownerId, connectorId: targetUid, ownerType },
          { ownerId: targetUid, connectorId: ownerId, ownerType },
        ],
      });
      return validateAndFormatData(getConnection, ConnectionDto);
    }
  );

  getAllConnection = warpAsync(
    async (
      args: { page: number; limit: number; status: string; ownerType: string },
      ownerId: string
    ): Promise<ServiceResponseType> => {
      const count = await this.countConnection(ownerId);
      return await paginate(
        Connection,
        ConnectionDto,
        count.count ?? 0,
        { page: args.page, limit: args.limit },
        null,
        { status: args.status, ownerType: args.ownerType }
      );
    }
  );

  filterConnectionByStatus = warpAsync(
    async (
      status: object,
      ownerId: string,
      ownerType: string
    ): Promise<ServiceResponseType> => {
      const getConnection = await Connection.find({
        ...status,
        ownerId,
        ownerType,
      }).lean();
      return validateAndFormatData(getConnection, ConnectionDto, "getAll");
    }
  );

  countConnection = warpAsync(
    async (
      status: object,
      ownerId: string,
      ownerType: string
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Connection.countDocuments({
          ownerId,
          ownerType,
          ...status,
        }),
      });
    }
  );

  deleteConnection = warpAsync(
    async (
      ownerId: string,
      targetUid: string,
      ownerType: string
    ): Promise<ServiceResponseType> => {
      const validation = this.preventToConnect(ownerId, targetUid);
      if (!validation?.success) return validation;

      return serviceResponse({
        deleteCount: (
          await Connection.deleteOne({
            $or: [
              { ownerId, connectorId: targetUid, ownerType },
              { ownerId: targetUid, connectorId: ownerId, ownerType },
            ],
          })
        ).deletedCount,
      });
    }
  );

  updateConnection = warpAsync(
    async (
      updatePayload: ConnectionUpdateDtoType,
      ownerId: string,
      targetUid: string,
      ownerType: string
    ): Promise<ServiceResponseType> => {
      const validation = this.preventToConnect(ownerId, targetUid);
      if (!validation?.success) return validation;

      const validationResult = validateAndFormatData(
        updatePayload,
        ConnectionUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const { statusTimestamps, idQuery, history } =
        await this.prepareConnectionUpdate(updatePayload, ownerId, targetUid);

      const updateConnection = await Connection.updateOne(
        { ownerType, ...idQuery },
        {
          $set: {
            ...validationResult.data.status,
            ...statusTimestamps,
            history,
          },
        }
      ).lean();
      return serviceResponse({
        data: updateConnection.modifiedCount,
      });
    }
  );

  private preventToConnect(ownerId: string, targetUid: string) {
    if (targetUid === ownerId)
      return serviceResponse({
        statusText: "BadRequest",
        message: "Cannot connect to yourself",
      });
    return { success: true };
  }

  private async prepareConnectionUpdate(
    updatePayload: ConnectionUpdateDtoType,
    ownerId: string,
    targetUid: string
  ) {
    const statusTimestamps =
      updatePayload.status === "blocked"
        ? { blockedAt: new Date() }
        : updatePayload.status === "unBlocked"
        ? { unBlockedAt: new Date() }
        : { acceptedAt: new Date() };

    const idQuery = {
      $or: [
        { ownerId, connectorId: targetUid },
        { ownerId: targetUid, connectorId: ownerId },
      ],
    };

    const history = {
      action: updatePayload.status,
      actionBy: ownerId,
      actionAt: new Date(),
    };

    return { statusTimestamps, idQuery, history };
  }
}
export default ConnectionService;
