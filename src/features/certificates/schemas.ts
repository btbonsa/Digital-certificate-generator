import { z } from "zod";

export const createCertificateSchema = z.object({
  recipient_id: z.number().min(1, "Recipient is required"),
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  issue_date: z.string().min(1, "Issue date is required"),
});

export type CreateCertificateFormData = z.infer<typeof createCertificateSchema>;
