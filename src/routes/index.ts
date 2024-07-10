import { Router } from 'express';
import user from '../routes/user.routes';
import auth from '../routes/auth.routes';

const router = Router({ mergeParams: true });

// /api/v1

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     refreshToken:
 *       type: apiKey
 *       in: header
 *       name: x-refresh
 *
 *
 *
 *   schemas:
 *     ApiResponse:
 *         - type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: ['success', 'error']
 *               description: 'Status of the response'
 *               example: 'success'
 *             data:
 *               type: object
 *               nullable: true
 *               description: 'Response data'
 *               example: null
 *             message:
 *               type: string
 *               description: 'Message describing the response'
 *               example: 'Operation successfully done'
 *             code:
 *               type: integer
 *               description: 'HTTP status code'
 *               example: 200
 *
 *
 *     BaseSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               example: 'success'
 *             data:
 *               example: null
 *             message:
 *               example: 'Success'
 *             code:
 *               example: 200
 *
 *
 *     CreatedSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               example: 'success'
 *             message:
 *               example: 'Item successfully created'
 *             code:
 *               example: 201
 *
 *
 *     BadRequestErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               example: 'error'
 *             data:
 *               example: null
 *             message:
 *               example: 'Bad request'
 *             code:
 *               example: 400
 *
 *
 *     UnauthorizedErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               example: 'error'
 *             data:
 *               example: null
 *             message:
 *               example: 'Unauthorized'
 *             code:
 *               example: 401
 *
 *
 *     ForbiddenErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               example: 'error'
 *             data:
 *               example: null
 *             message:
 *               example: 'Forbidden'
 *             code:
 *               example: 403
 *
 *
 *     ConflictErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               example: 'error'
 *             data:
 *               example: null
 *             message:
 *               example: 'Conflict'
 *             code:
 *               example: 409
 *
 *
 *     InternalServerErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               example: 'error'
 *             data:
 *               example: null
 *             message:
 *               example: 'Internal server error'
 *             code:
 *               example: 500
 *
 *
 * '/api/v1/healthcheck':
 *  get:
 *    tags:
 *      - HealthCheck
 *    summary: 'Responds if server is up and running'
 *    responses:
 *      '200':
 *        description: '**Server is up and running**'
 */
router.get('/healthcheck', (_, res) => res.sendStatus(200));

router.use('/users', user);
router.use('/auth', auth);

export default router;
