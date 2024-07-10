import { object, string } from 'zod';
import type { TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - passwordConfirmation
 *       properties:
 *         firstName:
 *           type: string
 *           description: 'First name of the user'
 *           example: 'John'
 *         lastName:
 *           type: string
 *           description: 'Last name of the user'
 *           example: 'Doe'
 *         email:
 *           type: string
 *           format: email
 *           description: 'Email address of the user'
 *           example: 'john.doe@example.com'
 *         password:
 *           type: string
 *           description: 'Password for the user account'
 *           pattern: "^(?=.*[a-zA-Zа-яА-Я])(?=.*[A-ZА-Я])(?=.*[a-zа-я])(?=.*\\d)(?=.*[@$!%*?&]).{8,32}$"
 *           example: 'Password123!'
 *         passwordConfirmation:
 *           type: string
 *           description: 'Password confirmation'
 *           example: 'Password123!'
 *
 *
 *     CreateUserSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/CreatedSuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               example: null
 *             message:
 *               example: 'User successfully created'
 *
 *
 *     CreateUserConflictResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ConflictErrorResponse'
 *         - type: object
 *           properties:
 *             data:
 *               example: null
 *             message:
 *               example: 'Account already exists'
 */
export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First name is required',
    }),
    lastName: string({
      required_error: 'Last name is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required',
    }).regex(
      /^(?=.*[a-zA-Zа-яА-Я])(?=.*[A-ZА-Я])(?=.*[a-zа-я])(?=.*\d)(?=.*[@$!%*?&]).{8,32}$/,
      'Password must be 8-32 characters long, include both upper and lower case letters (Latin or Cyrillic), a digit, and a special character from @$!%*?&',
    ),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     VerifyUserInput:
 *       type: object
 *       required:
 *         - userID
 *         - verificationCode
 *       properties:
 *         userID:
 *           type: string
 *           description: 'The ID of the user to verify'
 *           example: '668abddf1a6d986fe0774c0a'
 *         verificationCode:
 *           type: string
 *           description: 'The verification code for the user'
 *           example: 'd6efe19f-d89e-489d-a097-844127a213e5'
 *
 *
 *     VerifyUserSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseSuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               example: null
 *             message:
 *               example: 'User successfully verified'
 *
 *
 *     VerifyUserAlreadyVerifiedSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseSuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               example: null
 *             message:
 *               example: 'User is already verified'
 *
 *
 *     VerifyUserBadRequestResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BadRequestErrorResponse'
 *         - type: object
 *           properties:
 *             data:
 *               example: null
 *             message:
 *               example: 'Could not verify userd'
 */
export const verifyUserSchema = object({
  params: object({
    userID: string(),
    verificationCode: string(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 'Email address of the user'
 *           example: 'john.doe@example.com'
 *
 *
 *     ForgotPasswordSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseSuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               example: null
 *             message:
 *               example: 'If a user with this email exists, you will receive a password reset email'
 *
 *
 *     CreateUserConflictResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ConflictErrorResponse'
 *         - type: object
 *           properties:
 *             data:
 *               example: null
 *             message:
 *               example: 'Account already exists'
 */
export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ResetPasswordInputParams:
 *       type: object
 *       required:
 *         - userID
 *         - passwordResetCode
 *       properties:
 *         userID:
 *           type: string
 *           description: 'The ID of the user to reset password'
 *           example: '668abddf1a6d986fe0774c0a'
 *         passwordResetCode:
 *           type: string
 *           description: 'The password reset code for the user'
 *           example: 'd6efe19f-d89e-489d-a097-844127a213e5'
 *
 *
 *     ResetPasswordInputBody:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - passwordConfirmation
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 'Email address of the user'
 *           example: 'john.doe@example.com'
 *         password:
 *           type: string
 *           description: 'Password for the user account'
 *           pattern: "^(?=.*[a-zA-Zа-яА-Я])(?=.*[A-ZА-Я])(?=.*[a-zа-я])(?=.*\\d)(?=.*[@$!%*?&]).{8,32}$"
 *           example: 'Password123!'
 *         passwordConfirmation:
 *           type: string
 *           description: 'Password confirmation'
 *           example: 'Password123!'
 *
 *
 *     ResetPasswordSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseSuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               example: null
 *             message:
 *               example: 'Password successfully updated'
 */
export const resetPasswordSchema = object({
  params: object({
    userID: string({
      required_error: 'userID is required',
    }),
    passwordResetCode: string({
      required_error: 'Password reset code is required',
    }),
  }),
  body: object({
    password: string({
      required_error: 'Password is required',
    }).regex(
      /^(?=.*[a-zA-Zа-яА-Я])(?=.*[A-ZА-Я])(?=.*[a-zа-я])(?=.*\d)(?=.*[@$!%*?&]).{8,32}$/,
      'Password must be 8-32 characters long, include both upper and lower case letters (Latin or Cyrillic), a digit, and a special character from @$!%*?&',
    ),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     GetCurrentUserSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               example: 'success'
 *             data:
 *               type: object
 *               properties:
 *                 sessionID:
 *                   type: string
 *                   example: '668e4be04296ff6dadcbd463'
 *                 _id:
 *                   type: string
 *                   example: '668e4ae04296ff6dadcbd454'
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: 'john.doe2@example.com'
 *                 firstName:
 *                   type: string
 *                   example: 'John'
 *                 lastName:
 *                   type: string
 *                   example: 'Doe'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-06-10T08:48:32.516Z'
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-06-10T08:50:19.588Z'
 *                 iat:
 *                   type: integer
 *                   example: 1720601569
 *                 exp:
 *                   type: integer
 *                   example: 1720605169
 *             message:
 *               example: 'User data retrieved successfully'
 *             code:
 *               example: 200
 *
 *
 *     UserNotVerifiedErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ForbiddenErrorResponse'
 *         - type: object
 *           properties:
 *             message:
 *               example: 'User is not verified'
 */

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
