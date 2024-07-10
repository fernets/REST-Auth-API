import { Request, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * Middleware function to handle JSON parsing errors in Express applications.
 * If a SyntaxError is encountered during JSON parsing, it sends a 400 Bad Request response.
 * Otherwise, it passes the error to the next middleware.
 *
 * @param {Error} err - The error object passed from the previous middleware
 * @param {Request} _ - The Express request object (unused in this function)
 * @param {ApiResponse<null>} res - The Express response object, typed as ApiResponse<null>
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 * @returns {void}
 */
const jsonParseError = (err: Error, _: Request, res: ApiResponse<null>, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      data: null,
      message: 'Bad request',
      code: 400,
    });
  }
  next(err);
};

export default jsonParseError;
