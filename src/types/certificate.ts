export type CertificateStatus = "valid" | "revoked";

export interface Certificate {
  id: number;
  certificate_number: string;
  title: string;
  description?: string;
  recipient_id: number;
  recipient_name?: string;
  issue_date: string;
  status: CertificateStatus;
  verification_token: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCertificateRequest {
  recipient_id: number;
  title: string;
  description?: string;
  issue_date: string;
}

export interface CertificatesListResponse {
  certificates: Certificate[];
  total: number;
  page: number;
  limit: number;
}

export interface CertificateVerification {
  certificate: Certificate;
  recipient: {
    id: number;
    full_name: string;
    email?: string;
  };
  is_valid: boolean;
  status: CertificateStatus;
}
