import Certificate from "../../models/mongodb/company/certificate.model";
import {
  CertificateDto,
  CertificateAddDto,
  CertificateUpdateDto,
  CertificateAddDtoType,
  CertificateUpdateDtoType,
} from "../../dto/company/certificate.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { generatePagination } from "../../utils/generatePagination.util";
import { ServiceResponseType } from "../../types/response.type";
import { generateFilters } from "../../utils/generateFilters&Sort.util";
import { CertificateFiltersType } from "../../types/company.type";

class CertificateService {
  private static instanceService: CertificateService;
  public static getInstance(): CertificateService {
    if (!CertificateService.instanceService) {
      CertificateService.instanceService = new CertificateService();
    }
    return CertificateService.instanceService;
  }

  addCertificate = warpAsync(
    async (
      data: CertificateAddDtoType,
      userId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: CertificateAddDto,
      });
      if (!validationResult.success) return validationResult;

      await Certificate.create({
        ...data,
        companyId,
        uploadBy: userId,
      });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getCertificate = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data: await Certificate.findById({ _id }).lean(),
        userDto: CertificateDto,
      });
    }
  );

  getAllCertificates = warpAsync(
    async (
      queries: CertificateFiltersType,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<CertificateFiltersType>(queries);
      const count = await this.countCertificate(companyId, filters, true);
      return await generatePagination({
        model: Certificate,
        userDto: CertificateDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        fieldSearch: { companyId, ...filters },
      });
    }
  );

  countCertificate = warpAsync(
    async (
      companyId: string,
      queries: CertificateFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<CertificateFiltersType>(queries);
      return serviceResponse({
        count: await Certificate.countDocuments({
          companyId,
          ...filters,
        }),
      });
    }
  );

  updateCertificate = warpAsync(
    async (
      data: CertificateUpdateDtoType,
      _id: string,
      userId: string,
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: CertificateUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateCertificate = await Certificate.updateOne(
        { _id},
        {
          $set: { ...validationResult.data, updatedBy: userId },
        }
      );
      return serviceResponse({
        data: updateCertificate.modifiedCount,
      });
    }
  );

  deleteCertificate = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Certificate.deleteOne({ _id })).deletedCount,
      });
    }
  );
}

export default CertificateService;
