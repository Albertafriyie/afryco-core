"use server";

import { ID, Query, AppwriteException } from "node-appwrite";
import { users } from "../appwrite.config";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name,
    );

    return JSON.parse(JSON.stringify(newUser)) as User;
  } catch (error) {
    if (error instanceof AppwriteException && error?.code === 409) {
      const documents = await users.list({
        queries: [Query.equal("email", user.email)],
      });

      return JSON.parse(JSON.stringify(documents?.users[0])) as User;
    }

    console.error("Error creating user:", error);
  }
};
