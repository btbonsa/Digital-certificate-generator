import { z } from "zod";

export const createRecipientSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .trim()
    .min(2, "Full name must be at least 2 characters"),
  sex: z.string().min(1, "Sex is required"),
  date_of_birth: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().trim().min(1, "Phone is required"),
  profile_image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const updateRecipientSchema = createRecipientSchema.partial();

export type CreateRecipientFormData = z.infer<typeof createRecipientSchema>;
export type UpdateRecipientFormData = z.infer<typeof updateRecipientSchema>;
