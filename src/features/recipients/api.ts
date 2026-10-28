import { ApiError, apiClient } from "@/lib/api-client";
import type {
  Recipient,
  CreateRecipientRequest,
  UpdateRecipientRequest,
  RecipientsListResponse,
} from "@/types/recipient";

function isRecipient(value: unknown): value is Recipient {
  if (typeof value !== "object" || value === null) return false;

  const recipient = value as Record<string, unknown>;
  return (
    typeof recipient.id === "number" &&
    typeof recipient.full_name === "string" &&
    typeof recipient.created_at === "string" &&
    typeof recipient.updated_at === "string"
  );
}

export const recipientsApi = {
  async list(search?: string, page = 1, limit = 20): Promise<RecipientsListResponse> {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("limit", String(limit));
    const response: unknown = await apiClient.get(
      `/recipients?${params.toString()}`
    );

    if (typeof response !== "object" || response === null) {
      throw new ApiError("The recipients API returned an invalid response.");
    }

    const payload = response as Record<string, unknown>;
    const recipients = payload.recipients ?? payload.items;
    if (!Array.isArray(recipients) || !recipients.every(isRecipient)) {
      throw new ApiError("The recipients API response does not contain a valid recipients list.");
    }

    if (
      typeof payload.total !== "number" ||
      !Number.isFinite(payload.total) ||
      typeof payload.page !== "number" ||
      !Number.isFinite(payload.page) ||
      typeof payload.limit !== "number" ||
      !Number.isFinite(payload.limit)
    ) {
      throw new ApiError("The recipients API response is missing pagination details.");
    }

    return {
      recipients,
      total: payload.total,
      page: payload.page,
      limit: payload.limit,
    };
  },

  async get(id: number): Promise<Recipient> {
    const response: unknown = await apiClient.get(`/recipients/${id}`);
    if (typeof response !== "object" || response === null) {
      throw new ApiError("The recipient API returned an invalid response.");
    }

    const payload = response as Record<string, unknown>;
    const recipient = payload.recipient ?? payload.recipients ?? payload;
    if (!isRecipient(recipient)) {
      throw new ApiError("The recipient API response does not contain a valid recipient.");
    }

    return recipient;
  },

  async create(data: CreateRecipientRequest): Promise<Recipient> {
    return apiClient.post<Recipient>("/recipients", {
      full_name: data.full_name,
      sex: data.sex,
      phone: data.phone,
      birth_date: data.date_of_birth,
      image_url: data.profile_image_url,
    });
  },

  async update(id: number, data: UpdateRecipientRequest): Promise<Recipient> {
    return apiClient.put<Recipient>(`/recipients/${id}`, data);
  },
};
