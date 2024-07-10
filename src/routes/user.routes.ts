import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from '../controllers/user.controller';
import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.middleware';
import validateResource from '../middleware/validateResource.middleware';
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from '../schemas/user.schema';

const router = Router();

/**
 * @openapi
 * '/api/v1/users/register':
 *    post:
 *      tags:
 *        - User
 *      summary: 'Register a new user'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *       '201':
 *         description: '**User successfully created**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserSuccessResponse'
 *       '409':
 *         description: '**Account already exists**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserConflictResponse'
 *       '500':
 *         description: '**Internal server error**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post('/register', validateResource(createUserSchema), createUserHandler);

/**
 * @openapi
 * '/api/v1/users/verify/{userID}/{verificationCode}':
 *   post:
 *     tags:
 *       - User
 *     summary: 'Verify user account'
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           $ref: '#/components/schemas/VerifyUserInput/properties/userID'
 *         required: true
 *       - in: path
 *         name: verificationCode
 *         schema:
 *           $ref: '#/components/schemas/VerifyUserInput/properties/verificationCode'
 *         required: true
 *     responses:
 *       '200':
 *         description: '**User is verified**'
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/VerifyUserSuccessResponse'
 *                 - $ref: '#/components/schemas/VerifyUserAlreadyVerifiedSuccessResponse'
 *       '400':
 *         description: '**Could not verify user**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyUserBadRequestResponse'
 *       '500':
 *         description: '**Internal server error**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post(
  '/verify/:userID/:verificationCode',
  validateResource(verifyUserSchema),
  verifyUserHandler,
);

/**
 * @openapi
 * '/api/v1/users/forgotpassword':
 *   post:
 *     tags:
 *       - User
 *     summary: 'Send email with password reset link'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       '200':
 *         description: '**Password recovery email sent if user exists**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgotPasswordSuccessResponse'
 *       '403':
 *         description: '**User is not verified**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotVerifiedErrorResponse'
 *       '500':
 *         description: '**Internal server error**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post('/forgotpassword', validateResource(forgotPasswordSchema), forgotPasswordHandler);

/**
 * @openapi
 * '/api/v1/users/resetpassword/{userID}/{passwordResetCode}':
 *   post:
 *     tags:
 *       - User
 *     summary: 'Reset user password'
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           $ref: '#/components/schemas/ResetPasswordInputParams/properties/userID'
 *         required: true
 *       - in: path
 *         name: passwordResetCode
 *         schema:
 *           $ref: '#/components/schemas/ResetPasswordInputParams/properties/passwordResetCode'
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInputBody'
 *     responses:
 *       '200':
 *         description: '**Password successfully updated**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordSuccessResponse'
 *       '400':
 *         description: '**Bad request**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestErrorResponse'
 *       '500':
 *         description: '**Internal server error**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post(
  '/resetpassword/:userID/:passwordResetCode',
  validateResource(resetPasswordSchema),
  resetPasswordHandler,
);

/**
 * @openapi
 * '/api/v1/users/me':
 *   get:
 *     tags:
 *       - User
 *     summary: 'Get current authenticated user data'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: '**User data retrieved successfully**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetCurrentUserSuccessResponse'
 *       '401':
 *         description: '**Unauthorized**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       '500':
 *         description: '**Internal server error**'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.get('/me', requireAuth, getCurrentUserHandler);

export default router;
