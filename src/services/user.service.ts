import UserModel, { User } from '../models/user.model';
import log from '../utils/logger';

/**
 * Creates a new user in the database.
 *
 * This function attempts to create a new user entry in the database using the provided input.
 * If an error occurs during the creation process, it logs the error and re-throws it.
 *
 * @param input - An object containing partial user information to create a new user.
 *                It should conform to the User interface, but all fields are optional.
 *
 * @returns A Promise that resolves to the newly created User object.
 *
 * @throws Will throw an error if the user creation fails for any reason.
 *         The error is logged before being thrown.
 */
export async function createUser(input: Partial<User>) {
  try {
    return await UserModel.create(input);
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error creating user: ');
    } else {
      log.error(error, 'Something went wrong creating user: ');
    }
    throw error;
  }
}

/**
 * Finds a user in the database by their unique identifier.
 *
 * This function attempts to retrieve a user from the database using the provided user ID.
 * If an error occurs during the retrieval process, it logs the error and re-throws it.
 *
 * @param userID - A string representing the unique identifier of the user to be found.
 *
 * @returns A Promise that resolves to the found User object if successful, or null if no user is found.
 *
 * @throws Will throw an error if the user retrieval fails for any reason.
 *         The error is logged before being thrown.
 */
export async function findUserByID(userID: string) {
  try {
    return await UserModel.findById(userID);
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error finding user by ID: ');
    } else {
      log.error(error, 'Something went wrong finding user by ID: ');
    }
    throw error;
  }
}

/**
 * Finds a user in the database by their email address.
 *
 * This function attempts to retrieve a user from the database using the provided email address.
 * If an error occurs during the retrieval process, it logs the error and re-throws it.
 *
 * @param email - A string representing the email address of the user to be found.
 *
 * @returns A Promise that resolves to the found User object if successful, or null if no user is found.
 *
 * @throws Will throw an error if the user retrieval fails for any reason.
 *         The error is logged before being thrown.
 */
export async function findUserByEmail(email: string) {
  try {
    return await UserModel.findOne({ email });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error finding user by email: ');
    } else {
      log.error(error, 'Something went wrong finding user by email: ');
    }
    throw error;
  }
}
