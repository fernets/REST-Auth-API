import {
  createSessionHandler,
  logoutHandler,
  refreshAccessTokenHandler,
} from '../controllers/auth.controller';
import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.middleware';
import validateResource from '../middleware/validateResource.middleware';
import { createSessionSchema } from '../schemas/auth.schema';

const router = Router();

/**
 * @openapi
 * '/api/v1/auth/login':
 *   post:
 *     tags:
 *       - Auth
 *     summary: 'Log in to user account'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionInput'
 *     responses:
 *       '201':
 *         description: '**Session successfully created**'
 *         content:
 *           application/json:
 *             chema:
 *               $ref: '#/components/schemas/CreateSessionSuccessResponse'
 *       '400':
 *          description: '**Invalid email or password**'
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CreateSessionBadRequestResponse'
 *       '403':
 *          description: '**User is not verified**'
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserNotVerifiedErrorResponse'
 *       '500':
 *          description: '**Internal server error**'
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post('/login', validateResource(createSessionSchema), createSessionHandler);

/**
 * @openapi
 * '/api/v1/auth/refresh':
 *   post:
 *     tags:
 *       - Auth
 *     summary: 'Refresh access token'
 *     security:
 *       - BearerAuth: []
 *         refreshToken: []
 *     responses:
 *      '200':
 *        description: '**Access token successfully refreshed**'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RefreshAccessTokenSuccessResponse'
 *      '401':
 *        description: '**Unauthorized**'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *      '500':
 *        description: '**Internal server error**'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post('/refresh', refreshAccessTokenHandler);

/**
 * @openapi
 * '/api/v1/auth/logout':
 *   post:
 *     tags:
 *       - Auth
 *     summary: 'Log out from user account'
 *     security:
 *       - refreshToken: []
 *     responses:
 *      '200':
 *        description: '**Successfully logged out**'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LogOutSuccessResponse'
 *      '401':
 *        description: '**Unauthorized**'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *      '500':
 *        description: '**Internal server error**'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post('/logout', requireAuth, logoutHandler);

export default router;
