import { apiClient } from "@/lib/api-client";
import type { CertificateVerification } from "@/types/certificate";

export const verificationApi = {
  async verify(token: string): Promise<CertificateVerification> {
    return apiClient.get<CertificateVerification>(`/verify/${encodeURIComponent(token)}`);
  },
};
