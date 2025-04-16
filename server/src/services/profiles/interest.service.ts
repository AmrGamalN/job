import Interest from "../../models/mongodb/profiles/interest.model";
import {
  InterestDto,
  InterestAddDtoType,
  InterestAddDto,
} from "../../dto/profiles/interest.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";

type InterestType =
  | "industries"
  | "hobbies"
  | "influencers"
  | "companies"
  | "groups";

class InterestService {
  private static instanceService: InterestService;
  public static getInstance(): InterestService {
    if (!InterestService.instanceService) {
      InterestService.instanceService = new InterestService();
    }
    return InterestService.instanceService;
  }

  // Get interest
  getInterest = warpAsync(
    async (
      query: object,
      info: GraphQLResolveInfo
    ): Promise<responseHandler> => {
      const selectedFields = Object.keys(graphqlFields(info).data || {}).join(
        " "
      );
      const getInterest = await Interest.findOne(query)
        .lean()
        .select(selectedFields);
      if (!getInterest) {
        return {
          success: false,
          status: 404,
          message: "Interest not found",
        };
      }
      const parseSafeInterest = validateAndFormatData(getInterest, InterestDto);
      if (!parseSafeInterest.success) return parseSafeInterest;

      return {
        message: "Get interest successfully",
        ...parseSafeInterest,
      };
    }
  );

  // Update interest
  updateInterest = warpAsync(
    async (
      data: InterestAddDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(data, InterestAddDto);
      if (!parseSafe.success) return parseSafe;

      const keys = Object.keys(data) as InterestType[];
      if (keys.length !== 1 || !keys[0]) {
        return {
          success: false,
          status: 400,
          message: "Invalid interest data",
        };
      }
      const updateInterest = await Interest.updateOne(
        query,
        {
          $addToSet: {
            [keys[0]]: {
              $each: data[keys[0]],
            },
          },
        },
        {
          new: true,
        }
      ).lean();

      if (!updateInterest.modifiedCount) {
        return {
          success: false,
          status: 404,
          message: "Interest not found",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Update interest successfully",
        data: updateInterest,
      };
    }
  );

  // Delete interest
  deleteInterest = warpAsync(
    async (
      data: InterestAddDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(data, InterestAddDto);
      if (!parseSafe.success) return parseSafe;

      const keys = Object.keys(data) as InterestType[];
      if (keys.length !== 1 || !keys[0]) {
        return {
          success: false,
          status: 400,
          message: "Invalid interest data",
        };
      }
      const deleteInterest = await Interest.updateOne(query, {
        $pull: {
          [keys[0]]: {
            $in: data[keys[0]],
          },
        },
      });

      if (!deleteInterest.modifiedCount) {
        return {
          success: false,
          status: 404,
          message: "Interest not found",
        };
      }
      return {
        success: true,
        status: 200,
        message: "Delete interest successfully",
      };
    }
  );
}

export default InterestService;
