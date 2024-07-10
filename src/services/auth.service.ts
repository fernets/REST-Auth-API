import type { DocumentType } from '@typegoose/typegoose';
import lodash from 'lodash';
import SessionModel from '../models/session.model';
import { User, privateFields } from '../models/user.model';
import { signJWT } from '../utils/jwt';
import log from '../utils/logger';

/**
 * Creates a new session for a user.
 *
 * This function attempts to create a new session in the database using the provided user ID.
 * If successful, it returns the created session. If an error occurs during the process,
 * it logs the error and re-throws it.
 *
 * @param userID - The unique identifier of the user for whom the session is being created.
 *
 * @returns A Promise that resolves to the newly created session object.
 *
 * @throws Will throw an error if the session creation fails, after logging the error details.
 */
export async function createSession(userID: string) {
  try {
    return await SessionModel.create({ userID });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error creating session: ');
    } else {
      log.error(error, 'Something went wrong creating session: ');
    }
    throw error;
  }
}

/**
 * Retrieves a session from the database by its ID.
 *
 * This function attempts to find a session in the database using the provided session ID.
 * If successful, it returns the found session. If an error occurs during the process,
 * it logs the error and re-throws it.
 *
 * @param sessionID - The unique identifier of the session to be retrieved.
 *
 * @returns A Promise that resolves to the found session object, or null if no session is found.
 *
 * @throws Will throw an error if the session retrieval fails, after logging the error details.
 */
export async function getSessionByID(sessionID: string) {
  try {
    return await SessionModel.findById(sessionID);
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error finding session by ID: ');
    } else {
      log.error(error, 'Something went wrong finding session by ID: ');
    }
    throw error;
  }
}

/**
 * Invalidates a session by its ID.
 *
 * This function attempts to update a session in the database, setting its 'isValid' field to false.
 * If an error occurs during the process, it logs the error and re-throws it.
 *
 * @param sessionID - The unique identifier of the session to be invalidated.
 *
 * @returns A Promise that resolves when the session has been successfully invalidated.
 *
 * @throws Will throw an error if the session invalidation fails, after logging the error details.
 */
export async function invalidateSessionByID(sessionID: string) {
  try {
    await SessionModel.updateOne({ _id: sessionID }, { isValid: false });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error invalidating session: ');
    } else {
      log.error(error, 'Something went wrong invalidating session: ');
    }
    throw error;
  }
}

/**
 * Invalidates all sessions associated with a specific user ID.
 *
 * This function attempts to update all sessions in the database that match the given user ID,
 * setting their 'isValid' field to false. If an error occurs during the process,
 * it logs the error and re-throws it.
 *
 * @param userID - The unique identifier of the user whose sessions are to be invalidated.
 *
 * @returns A Promise that resolves when all sessions for the user have been successfully invalidated.
 *
 * @throws Will throw an error if the session invalidation fails, after logging the error details.
 */
export async function invalidateSessionsByUserID(userID: string) {
  try {
    await SessionModel.updateMany({ userID }, { isValid: false });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error invalidating session: ');
    } else {
      log.error(error, 'Something went wrong invalidating session: ');
    }
    throw error;
  }
}

/**
 * Creates a new session for a user and generates a refresh token.
 *
 * This function creates a new session, generates a refresh token using the session ID and user ID,
 * and returns both the refresh token and the session ID.
 *
 * @param userID - The unique identifier of the user for whom the session and refresh token are being created.
 *
 * @returns A Promise that resolves to an object containing:
 *   - refreshToken: A JWT refresh token string.
 *   - sessionID: The ID of the newly created session.
 *
 * @throws Will throw an error if:
 *   - Session creation fails
 *   - Refresh token signing fails
 *   - Any other unexpected error occurs during the process
 */
export async function signRefreshToken(userID: string) {
  try {
    const session = await createSession(userID);

    if (!session) {
      log.error('Error creating session');
      throw new Error('Error creating session');
    }

    const sessionID = String(session._id);

    const refreshToken = signJWT(
      {
        sessionID,
        userID: session.userID,
      },
      'refreshTokenPrivateKey',
      {
        expiresIn: '7d',
      },
    );

    if (refreshToken === null) {
      log.error('Error signing refresh token');
      throw new Error('Error signing refresh token');
    }

    return { refreshToken, sessionID };
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error signing refresh token: ');
    } else {
      log.error(error, 'Something went wrong signing refresh token: ');
    }
    throw error;
  }
}

/**
 * Signs and generates an access token for a user.
 *
 * This function creates a payload containing the session ID and user information,
 * then signs it to create an access token with a 60-minute expiration time.
 *
 * @param {Object} params - The parameters for signing the access token.
 * @param {DocumentType<User>} params.user - The user document for whom the token is being created.
 * @param {string} params.sessionID - The unique identifier of the user's session.
 *
 * @returns {string} The signed JWT access token.
 *
 * @throws {Error} If there's an error signing the access token or if the signing process returns null.
 */
export function signAccessToken({
  user,
  sessionID,
}: {
  user: DocumentType<User>;
  sessionID: string;
}) {
  try {
    const payload = { sessionID, ...lodash.omit(user.toJSON(), privateFields) };

    const accessToken = signJWT(payload, 'accessTokenPrivateKey', {
      expiresIn: '60m',
    });

    if (accessToken === null) {
      log.error('Error signing acess token');
      throw new Error('Error signing refresh token');
    }

    return accessToken;
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error signing access token: ');
    } else {
      log.error(error, 'Something went wrong signing access token: ');
    }
    throw error;
  }
}
