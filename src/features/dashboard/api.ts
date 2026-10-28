import { apiClient } from "@/lib/api-client";

export interface DashboardStats {
  total_recipients: number;
  total_certificates: number;
  valid_certificates: number;
  revoked_certificates: number;
}

export interface RecentCertificate {
  id: number;
  certificate_number: string;
  title: string;
  recipient_name: string;
  issue_date: string;
  status: "valid" | "revoked";
}

export interface DashboardData {
  stats: DashboardStats;
  recent_certificates: RecentCertificate[];
}

export const dashboardApi = {
  async getData(): Promise<DashboardData> {
    return apiClient.get<DashboardData>("/dashboard");
  },
};
