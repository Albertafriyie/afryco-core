import { z } from "zod";

// ==========================================
// 1. LANDING PAGE SIGN-UP SCHEMA
// ==========================================
export const UserFormValidation = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(50, "Username must be at most 50 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().refine((phone) => /^\+?[1-9]\d{1,14}$/.test(phone), {
    message: "Please enter a valid international phone number.",
  }),
});

// ==========================================
// 2. PATIENT REGISTRATION SCHEMA (Expanded Profile)
// ==========================================
export const PatientFormValidation = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().refine((phone) => /^\+?[1-9]\d{1,14}$/.test(phone), {
    message: "Please enter a valid international phone number.",
  }),
  birthDate: z.coerce.date({
    required_error: "Birth date is required.",
  }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required.",
  }),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters.")
    .optional(),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters.")
    .optional(),
  emergencyContactName: z
    .string()
    .min(2, "Emergency contact name must be at least 2 characters."),
  emergencyContactNumber: z
    .string()
    .refine((phone) => /^\+?[1-9]\d{1,14}$/.test(phone), {
      message: "Please enter a valid emergency contact phone number.",
    }),
  primaryPhysician: z
    .string()
    .min(2, "Please select at least one primary physician."),
  insuranceProvider: z.string(),
  insurancePolicyNumber: z.string(),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to privacy policy to proceed.",
  }),
  treatmentConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to treatment to proceed.",
  }),
  disclosureConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to disclosure policy to proceed.",
  }),
});

// ==========================================
// 3. APPOINTMENT SCHEMA
// ==========================================
export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().min(2, "Reason must be at least 2 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().optional(),
  schedule: z.coerce.date().optional(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().min(2, "Reason must be at least 2 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "cancel":
      return CancelAppointmentSchema;
    case "schedule":
      return ScheduleAppointmentSchema;
    default:
      return CreateAppointmentSchema;
  }
}
