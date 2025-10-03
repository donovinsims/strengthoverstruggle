import { z } from "zod";
import { APP_CONFIG } from "@/config/app.config";

const { validation } = APP_CONFIG;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(validation.name.minLength, { message: `Name must be at least ${validation.name.minLength} characters` })
    .max(validation.name.maxLength, { message: `Name must be less than ${validation.name.maxLength} characters` })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens, and apostrophes",
    }),
  business_name: z
    .string()
    .trim()
    .max(validation.businessName.maxLength, {
      message: `Business name must be less than ${validation.businessName.maxLength} characters`,
    })
    .optional(),
  phone: z
    .string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, { message: "Please enter a valid US phone number" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(validation.email.maxLength, { message: `Email must be less than ${validation.email.maxLength} characters` })
    .transform((val) => val.toLowerCase()),
  reason: z.string().refine(
    (val) => ["Donation Inquiry", "Gym Partnership", "Corporate Sponsorship", "Payment/Technical Issues", "General Questions", "Other"].includes(val),
    { message: "Please select a reason for contact" }
  ),
  message: z
    .string()
    .trim()
    .max(validation.message.maxLength, { message: `Message must be less than ${validation.message.maxLength} characters` })
    .optional(),
  website_url: z.string().max(0, { message: "This field should be empty" }).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
