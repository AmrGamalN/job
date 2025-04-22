import Interest from "../../models/mongodb/profiles/interest.model";
import {
  InterestDto,
  InterestAddDtoType,
  InterestAddDto,
} from "../../dto/profiles/interest.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
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
      return validateAndFormatData(getInterest, InterestDto);
    }
  );

  updateInterest = warpAsync(
    async (
      data: InterestAddDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(data, InterestAddDto, "update");
      if (!parsed.success) return parsed;

      const keys = Object.keys(parsed.data) as InterestType[];
      if (keys.length !== 1 || !keys[0])
        return serviceResponse({
          statusText: "BadRequest",
          message: "Invalid interest data",
        });

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
      return serviceResponse({
        data: updateInterest.modifiedCount,
      });
    }
  );

  deleteInterest = warpAsync(
    async (
      data: InterestAddDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(data, InterestAddDto, "delete");
      if (!parsed.success) return parsed;

      const keys = Object.keys(parsed.data) as InterestType[];
      if (keys.length !== 1 || !keys[0])
        return serviceResponse({
          statusText: "BadRequest",
          message: "Invalid interest data",
        });

      const deleteInterest = await Interest.updateOne(query, {
        $pull: {
          [keys[0]]: {
            $in: data[keys[0]],
          },
        },
      });
      return serviceResponse({
        data: deleteInterest.modifiedCount,
      });
    }
  );
}

export default InterestService;
