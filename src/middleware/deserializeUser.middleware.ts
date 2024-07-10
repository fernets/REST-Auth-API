import type { Request, NextFunction } from 'express';
import type { ApiResponse, UserWithSession } from '../types';
import { verifyJWT } from '../utils/jwt';
import log from '../utils/logger';

/**
 * Middleware function to deserialize the user from the access token in the request headers.
 * It verifies the JWT token, and if valid, attaches the decoded user data to the response locals.
 *
 * @param req - The Express request object.
 * @param res - The Express response object, extended with ApiResponse type.
 * @param next - The Express next function to pass control to the next middleware.
 *
 * @returns A Promise that resolves to void. The function either calls next() to continue
 * the middleware chain or sends an error response if deserialization fails.
 *
 * @throws Will send a 403 Forbidden response if the token is invalid.
 * @throws Will send a 500 Internal Server Error response for unexpected errors.
 */
const deserializeUser = async (req: Request, res: ApiResponse<null>, next: NextFunction) => {
  try {
    const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');

    if (!accessToken) {
      return next();
    }

    const decodedData = await verifyJWT<UserWithSession>(accessToken, 'accessTokenPublicKey');

    if (decodedData) {
      res.locals.user = decodedData;
    }

    return next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error deserializing user: ');

      return res.status(403).json({
        status: 'error',
        data: null,
        message: 'Forbidden',
        code: 403,
      });
    } else {
      log.error(error, 'Something went wrong deserializing user: ');

      return res.status(500).json({
        status: 'error',
        data: null,
        message: 'Internal server error',
        code: 500,
      });
    }
  }
};

export default deserializeUser;
