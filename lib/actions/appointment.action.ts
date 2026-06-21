"use server";

import { ID, Query } from "node-appwrite";
import { databases, messaging } from "../appwrite.config";
import { parseStringify } from "../utils";

// ==========================================
// 1. CREATE AN APPOINTMENT
// ==========================================
export const createAppointment = async (
  appointment: CreateAppointmentParams,
) => {
  try {
    const newAppointment = await databases.createDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENT_TABLE_ID!, // Make sure this key matches your .env.local precisely
      ID.unique(),
      appointment,
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

// ==========================================
// 2. GET APPOINTMENT DETAILS (For Success / Review Pages)
// ==========================================
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENT_TABLE_ID!,
      appointmentId,
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while fetching the appointment details:",
      error,
    );
  }
};

// ==========================================
// 3. UPDATE APPOINTMENT (Schedule / Cancel / Complete)
// ==========================================
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Modify database record via Document ID
    const updatedAppointment = await databases.updateDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENT_TABLE_ID!,
      appointmentId,
      appointment,
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    // Inspiration Note: You can easily trigger Twilio/Sms notifications here later based on `type`
    // e.g., if (type === 'schedule') { sendSMSNotification(...) }

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while updating the appointment:", error);
  }
};
