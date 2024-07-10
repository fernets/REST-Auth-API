import type { Request, NextFunction } from 'express';
import type { ApiResponse } from '../types';
import log from '../utils/logger';

/**
 * Middleware function to require authentication for protected routes.
 * It checks if a user is present in the response locals. If not, it sends a 403 Forbidden response.
 * If an error occurs during the process, it logs the error and sends an appropriate error response.
 *
 * @param {Request} _ - Express request object (unused in this function)
 * @param {ApiResponse<null>} res - Express response object with custom ApiResponse type
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 * @returns {void | Response} - If authentication fails, returns a response object. Otherwise, calls next()
 */
const requireAuth = (_: Request, res: ApiResponse<null>, next: NextFunction) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(403).json({
        status: 'error',
        data: null,
        message: 'Forbidden',
        code: 403,
      });
    }

    return next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error requiring user: ');

      return res.status(400).json({
        status: 'error',
        data: null,
        message: 'Bad request',
        code: 400,
      });
    } else {
      log.error(error, 'Error requiring user: ');

      return res.status(500).json({
        status: 'error',
        data: null,
        message: 'Internal server error',
        code: 500,
      });
    }
  }
};

export default requireAuth;
