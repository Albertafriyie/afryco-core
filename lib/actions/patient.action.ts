"use server";

import { ID, Query, AppwriteException } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

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

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.log("Error fetching user details:", error);
  }
};
