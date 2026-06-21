"use server";

import { ID, Query, AppwriteException } from "node-appwrite";
import { databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";

// ==========================================
// 1. CREATE AUTH USER
// ==========================================
export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name,
    );

    return parseStringify(newUser);
  } catch (error) {
    if (error instanceof AppwriteException && error?.code === 409) {
      const documents = await users.list({
        queries: [Query.equal("email", user.email)],
      });

      return parseStringify(documents?.users[0]);
    }

    console.error("Error creating user:", error);
  }
};

// ==========================================
// 2. GET AUTH USER & PATIENT DETAILS
// ==========================================
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.PATIENT_TABLE_ID!,
      [Query.equal("userId", userId)],
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

// ==========================================
// 3. REGISTER EXPANDED PATIENT MEDICAL PROFILE
// ==========================================
export const registerPatient = async ({
  identificationDocument,
  gender,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;

    // Handle identification file uploads via Appwrite Storage Buckets
    if (identificationDocument) {
      const fileBlob = identificationDocument.get("blobFile") as File;
      const fileName = identificationDocument.get("fileName") as string;

      if (fileBlob && fileName) {
        file = await storage.createFile({
          bucketId: process.env.NEXT_PUBLIC_BUCKET_ID!,
          fileId: ID.unique(),
          file: fileBlob,
        });
      }
    }

    // Save metadata profile straight into the Patients database collection
    const newPatient = await databases.createDocument({
      databaseId: process.env.DATABASE_ID!,
      collectionId: process.env.PATIENT_TABLE_ID!,
      documentId: ID.unique(),
      data: {
        ...patient,
        gender: gender.toLowerCase(),
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file?.$id
          ? `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file.$id}/view?project=${process.env.PROJECT_ID}`
          : null,
        ...patient,
      },
    });

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while registering a new patient:", error);
  }
};
