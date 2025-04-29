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
import { paginate } from "../../utils/pagination.util";
import { ServiceResponseType } from "../../types/response.type";

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
      certificateData: CertificateAddDtoType,
      userId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        certificateData,
        CertificateAddDto
      );
      if (!validationResult.success) return validationResult;

      await Certificate.create({
        ...certificateData,
        companyId,
        uploadBy: userId,
      });
      ``;
      return serviceResponse({
        statusText: "Created",
        message: "Certificate created successfully",
      });
    }
  );

  getCertificate = warpAsync(
    async (certificateId: string): Promise<ServiceResponseType> => {
      const getCertificate = await Certificate.findOne({
        _id: certificateId,
      }).lean();
      return validateAndFormatData(getCertificate, CertificateDto);
    }
  );

  getAllCertificates = warpAsync(
    async (
      filters: {
        page: number;
        limit: number;
        title: string;
      },
      companyId: string
    ): Promise<ServiceResponseType> => {
      const count = await this.countCertificate(companyId, filters.title);
      return await paginate(
        Certificate,
        CertificateDto,
        count.count ?? 0,
        {
          page: filters.page,
          limit: filters.limit,
        },
        null,
        { companyId, ...this.filterCertificates(filters.title) }
      );
    }
  );

  countCertificate = warpAsync(
    async (
      query: {
        title: string;
      },
      companyId: string
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Certificate.countDocuments({
          companyId,
          ...this.filterCertificates(query.title),
        }),
      });
    }
  );

  updateCertificate = warpAsync(
    async (
      CertificateData: CertificateUpdateDtoType,
      certificateId: string,
      userId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        CertificateData,
        CertificateUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateCertificate = await Certificate.updateOne(
        { _id: certificateId, companyId },
        {
          $set: { ...validationResult.data, updatedBy: userId },
        }
      ).lean();
      return serviceResponse({
        data: updateCertificate.modifiedCount,
      });
    }
  );

  deleteCertificate = warpAsync(
    async (
      certificateId: string,
      companyId: string
    ): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Certificate.deleteOne({ _id: certificateId, companyId }))
          .deletedCount,
      });
    }
  );

  private filterCertificates = (title: string) => {
    let filters: Record<string, string | object> = {};

    if (title) {
      filters["title"] = { $regex: title, $options: "i" };
    }
    return filters;
  };
}

export default CertificateService;
