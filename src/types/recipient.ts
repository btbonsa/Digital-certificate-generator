export interface Recipient {
  id: number;
  full_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRecipientRequest {
  full_name: string;
  sex: string;
  date_of_birth?: string;
  email?: string;
  phone: string;
  profile_image_url?: string;
}

export interface UpdateRecipientRequest {
  full_name?: string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
}

export interface RecipientsListResponse {
  recipients: Recipient[];
  total: number;
  page: number;
  limit: number;
}
