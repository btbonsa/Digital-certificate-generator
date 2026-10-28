import { apiClient } from "@/lib/api-client";
import type {
  Certificate,
  CreateCertificateRequest,
  CertificatesListResponse,
} from "@/types/certificate";

export const certificatesApi = {
  async list(search?: string, status?: string, page = 1, limit = 20): Promise<CertificatesListResponse> {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("page", String(page));
    params.set("limit", String(limit));
    const queryString = params.toString();
    return apiClient.get<CertificatesListResponse>(
      `/certificates${queryString ? `?${queryString}` : ""}`
    );
  },

  async get(id: number): Promise<Certificate> {
    return apiClient.get<Certificate>(`/certificates/${id}`);
  },

  async create(data: CreateCertificateRequest): Promise<Certificate> {
    return apiClient.post<Certificate>("/certificates", data);
  },

  async downloadPdf(id: number): Promise<Blob> {
    return apiClient.downloadBlob(`/certificates/${id}/pdf`);
  },
};
