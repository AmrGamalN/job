import Document from "../../models/mongodb/company/document.model";
import {
  DocumentDto,
  DocumentAddDto,
  DocumentUpdateDto,
  DocumentAddDtoType,
  DocumentUpdateDtoType,
} from "../../dto/company/document.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { ServiceResponseType } from "../../types/response.type";
import { DocumentFiltersType } from "../../types/company.type";
import { generateFilters } from "../../utils/generateFilters&Sort.util";

class DocumentService {
  private static instanceService: DocumentService;
  public static getInstance(): DocumentService {
    if (!DocumentService.instanceService) {
      DocumentService.instanceService = new DocumentService();
    }
    return DocumentService.instanceService;
  }

  addDocument = warpAsync(
    async (
      data: DocumentAddDtoType,
      userId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: DocumentAddDto,
      });
      if (!validationResult.success) return validationResult;

      await Document.create({
        ...data,
        companyId,
        uploadBy: userId,
      });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getDocument = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await Document.findById({ _id }).lean(),
      userDto: DocumentDto,
    });
  });

  getAllDocuments = warpAsync(
    async (
      queries: DocumentFiltersType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<DocumentFiltersType>(queries);
      const count = await this.countDocument(companyId, filters, true);
      return await generatePagination({
        model: Document,
        userDto: DocumentDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { companyId, ...filters },
      });
    }
  );

  countDocument = warpAsync(
    async (
      companyId: string,
      queries: DocumentFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<DocumentFiltersType>(queries);
      return serviceResponse({
        count: await Document.countDocuments({
          ...filters,
          companyId,
        }),
      });
    }
  );

  updateDocument = warpAsync(
    async (
      data: DocumentUpdateDtoType,
      _id: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: DocumentUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateDocument = await Document.updateOne(
        { _id },
        {
          $set: { ...validationResult.data, updatedBy: userId },
        }
      );
      return serviceResponse({
        data: updateDocument.modifiedCount,
      });
    }
  );

  deleteDocument = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Document.deleteOne({ _id })).deletedCount,
      });
    }
  );
}

export default DocumentService;
