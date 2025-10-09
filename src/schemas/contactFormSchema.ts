import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),
  reason: z.string()
    .min(1, "Please select a reason for contact"),
  message: z.string()
    .max(1000, "Message must be less than 1000 characters")
    .optional()
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactReasons = [
  "Donation Inquiry",
  "Gym Partnership",
  "Corporate Sponsorship",
  "Payment/Technical Issues",
  "General Questions",
  "Other"
] as const;
