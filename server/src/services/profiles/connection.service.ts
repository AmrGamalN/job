import Connection from "../../models/mongodb/profiles/connection.model";
import {
  ConnectionDto,
  ConnectionAddDto,
  ConnectionUpdateDto,
  ConnectionAddDtoType,
  ConnectionUpdateDtoType,
} from "../../dto/profiles/connection.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { PaginationGraphQl } from "../../utils/pagination";
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
      userId: string
    ): Promise<responseHandler> => {
      const validation = this.preventToConnect(userId, targetUid.userId);
      if (!validation?.success) return validation;

      const parsed = validateAndFormatData(targetUid, ConnectionAddDto);
      if (!parsed.success) return parsed;

      const [getUser, getConnection] = await Promise.all([
        Security.findOne({ userId: targetUid.userId }).lean(),
        Connection.findOne({
          $or: [
            { userId, connectorId: targetUid.userId },
            { userId: targetUid.userId, connectorId: userId },
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
      await Connection.create({ connectorId: targetUid.userId, userId });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getConnection = warpAsync(
    async (userId: string, targetUid: string): Promise<responseHandler> => {
      const validation = this.preventToConnect(userId, targetUid);
      if (!validation?.success) return validation;

      const getConnection = await Connection.findOne({
        $or: [
          { userId, connectorId: targetUid },
          { userId: targetUid, connectorId: userId },
        ],
      });
      return validateAndFormatData(getConnection, ConnectionDto);
    }
  );

  getAllConnection = warpAsync(
    async (
      args: { page: number; limit: number; status: string },
      userId: string
    ): Promise<responseHandler> => {
      const count = await this.countConnection(userId);
      return await PaginationGraphQl(
        Connection,
        ConnectionDto,
        count.count ?? 0,
        { page: args.page, limit: args.limit },
        null,
        { status: args.status }
      );
    }
  );

  filterConnectionByStatus = warpAsync(
    async (status: object, userId: string): Promise<responseHandler> => {
      const getConnection = await Connection.find({ ...status, userId }).lean();
      return validateAndFormatData(getConnection, ConnectionDto, "getAll");
    }
  );

  countConnection = warpAsync(
    async (status: object, userId: string): Promise<responseHandler> => {
      return serviceResponse({
        count: await Connection.countDocuments({
          userId,
          ...status,
        }),
      });
    }
  );

  deleteConnection = warpAsync(
    async (userId: string, targetUid: string): Promise<responseHandler> => {
      const validation = this.preventToConnect(userId, targetUid);
      if (!validation?.success) return validation;

      return serviceResponse({
        deleteCount: (
          await Connection.deleteOne({
            $or: [
              { userId, connectorId: targetUid },
              { userId: targetUid, connectorId: userId },
            ],
          })
        ).deletedCount,
      });
    }
  );

  updateConnection = warpAsync(
    async (
      updatePayload: ConnectionUpdateDtoType,
      userId: string,
      targetUid: string
    ): Promise<responseHandler> => {
      const validation = this.preventToConnect(userId, targetUid);
      if (!validation?.success) return validation;

      const parsed = validateAndFormatData(
        updatePayload,
        ConnectionUpdateDto,
        "update"
      );
      if (!parsed.success) return parsed;

      const { statusTimestamps, idQuery, history } =
        await this.prepareConnectionUpdate(updatePayload, userId, targetUid);

      const updateConnection = await Connection.updateOne(idQuery, {
        $set: {
          ...parsed.data.status,
          ...statusTimestamps,
          history,
        },
      }).lean();
      return serviceResponse({
        data: updateConnection.modifiedCount,
      });
    }
  );

  private preventToConnect(userId: string, targetUid: string) {
    if (targetUid === userId)
      return serviceResponse({
        statusText: "BadRequest",
        message: "Cannot connect to yourself",
      });
    return { success: true };
  }

  private async prepareConnectionUpdate(
    updatePayload: ConnectionUpdateDtoType,
    userId: string,
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
        { userId, connectorId: targetUid },
        { userId: targetUid, connectorId: userId },
      ],
    };

    const history = {
      action: updatePayload.status,
      actionBy: userId,
      actionAt: new Date(),
    };

    return { statusTimestamps, idQuery, history };
  }
}
export default ConnectionService;
