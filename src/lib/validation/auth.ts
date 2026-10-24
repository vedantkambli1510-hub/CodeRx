import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
  role: z.enum(["PATIENT", "DOCTOR"]).default("PATIENT"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const PatientProfileSchema = z.object({
  dob: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
});

export const BookAppointmentSchema = z.object({
  slotId: z.string().min(1, "Please select an appointment slot"),
  doctorId: z.string().min(1, "Doctor ID is required"),
  paymentMethod: z.string().optional().default("GOOGLE_PAY"),
  transactionId: z.string().optional(),
});


export const RescheduleAppointmentSchema = z.object({
  appointmentId: z.string().min(1),
  newSlotId: z.string().min(1, "Please select a new appointment slot"),
});

export const DoctorSlotCreateSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.coerce.number().min(15).max(120).default(30),
});

export const DoctorNoteSchema = z.object({
  appointmentId: z.string().min(1),
  content: z.string().min(1, "Note content cannot be empty"),
});
