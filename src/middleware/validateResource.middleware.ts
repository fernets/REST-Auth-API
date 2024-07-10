import type { Request, NextFunction } from 'express';
import type { AnyZodObject } from 'zod';
import type { ApiResponse } from '../types';
import log from '../utils/logger';

/**
 * Creates a middleware function that validates incoming request data against a provided Zod schema.
 *
 * @param {AnyZodObject} schema - The Zod schema to validate the request against.
 * @returns {Function} A middleware function that takes Express request, response, and next function as parameters.
 *
 * @example
 * const userSchema = z.object({
 *   body: z.object({
 *     username: z.string(),
 *     email: z.string().email(),
 *   }),
 * });
 * app.post('/users', validateResource(userSchema), createUser);
 */
const validateResource =
  (schema: AnyZodObject) => (req: Request, res: ApiResponse<null>, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(error.message, 'Error validating resource: ');
      } else {
        log.error(error, 'Something went wrong validating resource: ');
      }

      return res.status(400).json({
        status: 'error',
        data: null,
        message: 'Bad request',
        code: 400,
      });
    }
  };

export default validateResource;
