import type { Request } from 'express';
import lodash from 'lodash';
import type { createSessionInput } from '../schemas/auth.schema';
import { invalidateSessionByID, signAccessToken, signRefreshToken } from '../services/auth.service';
import { findUserByEmail, findUserByID } from '../services/user.service';
import { verifyJWT } from '../utils/jwt';
import type { ApiResponse, Session } from '../types';
import log from '../utils/logger';

type SessionData = { accessToken: string; refreshToken: string };
type AccessTokenData = Pick<SessionData, 'accessToken'>;

/**
 * Handles the creation of a new session by verifying user credentials and generating access and refresh tokens.
 *
 * @param req - The Express request object containing the user's email and password in the request body.
 * @param res - The Express response object to send the API response.
 *
 * @returns - An HTTP response with status code 201 (Created) if the session is successfully created,
 * or an error response with appropriate status codes (400, 403, 500) if there are validation errors or server errors.
 *
 * @throws - Throws an error if there is a problem with the request or response.
 */
export async function createSessionHandler(
  req: Request<Record<string, never>, unknown, createSessionInput>,
  res: ApiResponse<SessionData>,
) {
  const { email, password } = req.body;

  const errorMessage = 'Invalid email or password';

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ status: 'error', data: null, message: errorMessage, code: 400 });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ status: 'error', data: null, message: 'User is not verified', code: 403 });
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: 'error', data: null, message: errorMessage, code: 400 });
    }

    const { refreshToken, sessionID } = await signRefreshToken(String(user._id));

    const accessToken = signAccessToken({ user, sessionID });

    return res.status(201).json({
      status: 'success',
      data: { accessToken, refreshToken },
      message: 'Session successfully created',
      code: 201,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error creating session: ');
    } else {
      log.error(error, 'Something went wrong creating session: ');
    }
    return res
      .status(500)
      .json({ status: 'error', data: null, message: 'Internal server error', code: 500 });
  }
}

/**
 * Handles the refreshing of an access token using a provided refresh token.
 *
 * This function verifies the refresh token, checks for user existence, and generates a new access token.
 * It returns appropriate responses based on the success or failure of the token refresh process.
 *
 * @param req - The Express request object containing the refresh token in the 'x-refresh' header.
 * @param res - The Express response object of type ApiResponse<AccessTokenData> to send the API response.
 *
 * @returns A Promise that resolves to an HTTP response:
 *  - 200 status with a new access token if successful.
 *  - 401 status if unauthorized (invalid or missing refresh token, or user not found).
 *  - 500 status if there's an internal server error.
 *
 * @throws May throw an error if there are issues with token verification or user lookup.
 */
export async function refreshAccessTokenHandler(req: Request, res: ApiResponse<AccessTokenData>) {
  try {
    const refreshTokenHeader = lodash.get(req, 'headers.x-refresh');

    const errorMessage = 'Unauthorized';

    if (!refreshTokenHeader) {
      return res
        .status(401)
        .json({ status: 'error', data: null, message: errorMessage, code: 401 });
    }

    const refreshToken = Array.isArray(refreshTokenHeader)
      ? refreshTokenHeader[0]
      : refreshTokenHeader;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ status: 'error', data: null, message: errorMessage, code: 401 });
    }

    const decodedData = await verifyJWT<Session>(refreshToken, 'refreshTokenPublicKey');

    if (!decodedData) {
      return res
        .status(401)
        .json({ status: 'error', data: null, message: errorMessage, code: 401 });
    }

    const user = await findUserByID(String(decodedData.userID));

    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', data: null, message: errorMessage, code: 401 });
    }

    const accessToken = signAccessToken({ user, sessionID: decodedData.sessionID });

    return res.status(200).json({
      status: 'success',
      data: { accessToken },
      message: 'Access token successfully refreshed',
      code: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error refreshing token: ');
    } else {
      log.error(error, 'Something went wrong refreshing token: ');
    }
    return res
      .status(500)
      .json({ status: 'error', data: null, message: 'Internal server error', code: 500 });
  }
}

/**
 * Handles the logout process for a user session.
 *
 * This function invalidates the user's session, clears the user data from the response locals,
 * and returns a success message. If there's no valid session or an error occurs during the process,
 * it returns an appropriate error response.
 *
 * @param _ - The Express request object (unused in this function, hence the underscore).
 * @param res - The Express response object of type ApiResponse<null> to send the API response.
 *
 * @returns A Promise that resolves to an HTTP response:
 *  - 200 status with a success message if the logout is successful.
 *  - 401 status if there's no valid session (Unauthorized).
 *  - 500 status if there's an internal server error during the logout process.
 *
 * @throws May throw an error if there are issues with session invalidation or response handling.
 */
export async function logoutHandler(_: Request, res: ApiResponse<null>) {
  try {
    const sessionID = lodash.get(res, 'locals.user.sessionID');

    if (!sessionID) {
      return res
        .status(401)
        .json({ status: 'error', data: null, message: 'Unauthorized', code: 401 });
    }

    await invalidateSessionByID(sessionID);
    res.locals.user = undefined;

    return res
      .status(200)
      .json({ status: 'success', data: null, message: 'Successfully logged out', code: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error logging out: ');
    } else {
      log.error(error, 'Something went wrong logging out: ');
    }
    return res
      .status(500)
      .json({ status: 'error', data: null, message: 'Internal server error', code: 500 });
  }
}
