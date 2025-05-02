import { warpAsync } from "../../utils/warpAsync.util";
import { ServiceResponseType } from "../../types/response.type";
import { redisClient } from "../../config/redisConfig";
import { analyticsFields } from "../../types/job.type";
import { serviceResponse } from "../../utils/response.util";

class JobAnalyticsService {
  private static instanceService: JobAnalyticsService;
  public static getInstance(): JobAnalyticsService {
    if (!JobAnalyticsService.instanceService) {
      JobAnalyticsService.instanceService = new JobAnalyticsService();
    }
    return JobAnalyticsService.instanceService;
  }

  createAnalytics = warpAsync(
    async (
      id: string,
      expireAt: Date,
      keywords: string[]
    ): Promise<ServiceResponseType> => {
      const exists = await redisClient.exists(id);
      if (exists) {
        return serviceResponse({
          statusText: "Conflict",
          message: "Analytics already exists",
        });
      }

      console.log(keywords);
      const pipeline = redisClient.multi();
      keywords.forEach((keyword) => {
        analyticsFields.forEach((field) => {
          if (field.toLowerCase().includes(keyword.toLowerCase())) {
            return pipeline.hSetNX(id, field, "0");
          }
        });
      });
      console.log(pipeline);
      pipeline.expireAt(id, Math.floor(expireAt.getTime() / 1000));
      await pipeline.exec();
      return serviceResponse({
        statusText: "Created",
        message: "Analytics created successfully",
      });
    }
  );

  getAnalytics = warpAsync(async (id: string): Promise<ServiceResponseType> => {
    const existingAnalytics = await this.existingAnalytics(String(id));
    if (!existingAnalytics.success) return existingAnalytics;
    return serviceResponse({
      statusText: "OK",
      data: existingAnalytics.data,
    });
  });

  updateAnalytics = warpAsync(
    async (
      id: string,
      keywordsIncrement: string[] = [],
      keywordsDecrement: string[] = []
    ): Promise<ServiceResponseType> => {
      const matchFields = (keywords: string[]) => {
        const lowerKeywords = keywords?.map((k) => k.toLowerCase());
        return analyticsFields?.filter((field) =>
          lowerKeywords.some((keyword) => field.toLowerCase().includes(keyword))
        );
      };

      console.log(keywordsDecrement);
      console.log(matchFields(keywordsDecrement));
      const pipeline = redisClient.multi();
      matchFields(keywordsIncrement)?.forEach((field) =>
        pipeline.hIncrBy(id, field, 1)
      );
      matchFields(keywordsDecrement)?.forEach((field) =>
        pipeline.hIncrBy(id, field, -1)
      );
      console.log(pipeline);
      await pipeline.exec();
      return serviceResponse({
        statusText: "OK",
      });
    }
  );

  resetAnalyticsByName = warpAsync(
    async (
      fields: { resetByName: [string] },
      id: string
    ): Promise<ServiceResponseType> => {
      const existingAnalytics = await this.existingAnalytics(id);
      if (!existingAnalytics.success) return existingAnalytics;
      fields["resetByName"].forEach((fieldName: string) => {
        redisClient.hSet(id, fieldName, 0);
      });
      return serviceResponse({
        statusText: "OK",
        message: `Reset successfully`,
      });
    }
  );

  resetAllAnalytics = warpAsync(
    async (id: string): Promise<ServiceResponseType> => {
      const existingAnalytics = await this.existingAnalytics(id);
      if (!existingAnalytics.success) return existingAnalytics;
      Object.keys(existingAnalytics.data).forEach((field) => {
        redisClient.hSet(id, field, "0");
      });
      return serviceResponse({
        statusText: "OK",
        message: "All analytics reset successfully",
      });
    }
  );

  private existingAnalytics = warpAsync(
    async (id: string): Promise<ServiceResponseType> => {
      const existingAnalytics = await redisClient.hGetAll(String(id));
      if (Object.keys(existingAnalytics).length === 0) {
        return serviceResponse({
          statusText: "NotFound",
          message: "Analytics not found",
        });
      }
      return { success: true, data: existingAnalytics };
    }
  );

  deleteAnalytics = warpAsync(
    async (id: string): Promise<ServiceResponseType> => {
      const existingAnalytics = await this.existingAnalytics(id);
      if (!existingAnalytics.success) return existingAnalytics;
      await redisClient.del(id);
      return serviceResponse({
        statusText: "OK",
        message: "Analytics deleted successfully",
      });
    }
  );
}
export default JobAnalyticsService;
