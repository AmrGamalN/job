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
import { paginate } from "../../utils/pagination.util";
import { ServiceResponseType } from "../../types/response.type";
import { DocumentFiltersType } from "../../types/company.type";

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
      documentData: DocumentAddDtoType,
      userId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        documentData,
        DocumentAddDto
      );
      if (!validationResult.success) return validationResult;

      await Document.create({
        ...documentData,
        companyId,
        uploadBy: userId,
      });
      return serviceResponse({
        statusText: "Created",
        message: "Document created successfully",
      });
    }
  );

  getDocument = warpAsync(
    async (documentId: string): Promise<ServiceResponseType> => {
      const getDocument = await Document.findOne({
        _id: documentId,
      }).lean();
      return validateAndFormatData(getDocument, DocumentDto);
    }
  );

  getAllDocuments = warpAsync(
    async (
      filters: DocumentFiltersType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const count = await this.countDocument(filters, companyId);
      return await paginate(
        Document,
        DocumentDto,
        count.count ?? 0,
        {
          page: filters?.page,
          limit: filters?.limit,
        },
        null,
        { companyId, ...this.filterDocuments(filters) }
      );
    }
  );

  countDocument = warpAsync(
    async (
      filters: DocumentFiltersType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Document.countDocuments({
          ...this.filterDocuments(filters),
          companyId,
        }),
      });
    }
  );

  updateDocument = warpAsync(
    async (
      DocumentData: DocumentUpdateDtoType,
      documentId: string,
      userId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        DocumentData,
        DocumentUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateDocument = await Document.updateOne(
        { _id: documentId, companyId },
        {
          $set: { ...validationResult.data, updatedBy: userId },
        }
      ).lean();
      return serviceResponse({
        data: updateDocument.modifiedCount,
      });
    }
  );

  deleteDocument = warpAsync(
    async (
      documentId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Document.deleteOne({ _id: documentId, companyId }))
          .deletedCount,
      });
    }
  );

  private filterDocuments = (queries: DocumentFiltersType) => {
    const filtersOption: (keyof typeof queries)[] = ["name"];
    let filters: Record<string, string | object> = {};

    if (queries.start && queries.end) {
      filters["createdAt"] = { $gte: queries.start, $lte: queries.end };
    }

    if (queries.type) {
      filters["documentFile.type"] = queries.type;
    }

    for (const key of filtersOption) {
      if (queries[key] && typeof queries[key] == "string")
        filters[key] = queries[key];
    }
    return filters;
  };
}

export default DocumentService;
