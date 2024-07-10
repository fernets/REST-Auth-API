import { object, string } from 'zod';
import type { TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateSessionInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 'Email address of the user'
 *           example: 'john.doe@example.com'
 *         password:
 *           type: string
 *           description: 'Password for the user account'
 *           example: 'Password123!'
 *
 *
 *     CreateSessionSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/CreatedSuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSUQiOiI2NjhlNTA0MmE3MTk4ZjFmYTc3NzBmYzAiLCJfaWQiOiI2NjhlNGFlMDQyOTZmZjZkYWRjYmQ0NTQiLCJlbWFpbCI6ImpvaG4uZG9lMkBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsImNyZWF0ZWRBdCI6IjIwMjQtMDctMTBUMDg6NDg6MzIuNTE2WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDctMTBUMDg6NTA6MTkuNTg4WiIsImlhdCI6MTcyMDYwMjY5MCwiZXhwIjoxNzIwNjA2MjkwfQ.ir9uMurwGiAFbobWM9P0nxqNwOAgqi_fbrEEoGORPtEYXHTTy8QG7FCoOOw-tW027fSGj3Y5xeD5PzRXNnGPHpJFAgCn6XXK0gQuGbXqMxtQYIO5ox-fnW0sNMMym91IPBWQVotDgEkG0zq2sHraJpzMY31bQuZwBvdAokQ4wRLeMyUHru3m6TA2vkBigsziLBR_f5X8aljVbbegc9S2gvE58azTbh409kYFjUf7hFr1FIZSiVe7SlV0D_DigP8haV92RNlwy-hLd-0pOh-Z9K9pDV8o6YXCE9baqdgmHW0pdyDKKWbgq4sEV6pcDyF3X7DEJ9tV1IxSxTDPa2ZQdA'
 *                 refreshToken:
 *                   type: string
 *                   example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSUQiOiI2NjhlNTA0MmE3MTk4ZjFmYTc3NzBmYzAiLCJ1c2VySUQiOiI2NjhlNGFlMDQyOTZmZjZkYWRjYmQ0NTQiLCJpYXQiOjE3MjA2MDI2OTAsImV4cCI6MTcyMTIwNzQ5MH0.Mq8VWNRD2AJbC6nDYRiq6j8eK_7dD4cIqEl_MpxhKeFuq2vDu2KyGmamasAASuqemgT3KLyT5pYZk7x6PthTDeDd7z9Ah_JJwUlQrpbb-KUq2D5pQv5XBPQfMomZEM977ATxqdMbHtoCgCBxWUt6n9_ATicwLBTzxnoyFLoaCMDfpCD8xdZ_qeEAmVgDGJwk5xrdHF_M9IydVJ1yEBYXS3mlnHFknqQEOkCtdx5v4PphpwfITc9k4gWaH0XmmXlWsrw94Up5J6BfloXj3z6DkQ5fpjtN0gYP46tG-Q2yjNNwMhFmoz1U6s2WYeAt-pu7ZPZHgXFiRaE_TZ8KOzhZrA'
 *             message:
 *               example: 'Session successfully created'
 *
 *
 *     CreateSessionBadRequestResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BadRequestErrorResponse'
 *         - type: object
 *           properties:
 *             message:
 *               example: 'Invalid email or password'
 */
export const createSessionSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email('Invalid email or password'),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Invalid email or password',
    ),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateSessionInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 'Email address of the user'
 *           example: 'john.doe@example.com'
 *         password:
 *           type: string
 *           description: 'Password for the user account'
 *           example: 'Password123!'
 *
 *
 *     RefreshAccessTokenSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseSuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSUQiOiI2NjhlNTA0MmE3MTk4ZjFmYTc3NzBmYzAiLCJfaWQiOiI2NjhlNGFlMDQyOTZmZjZkYWRjYmQ0NTQiLCJlbWFpbCI6ImpvaG4uZG9lMkBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsImNyZWF0ZWRBdCI6IjIwMjQtMDctMTBUMDg6NDg6MzIuNTE2WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDctMTBUMDg6NTA6MTkuNTg4WiIsImlhdCI6MTcyMDYwMjY5MCwiZXhwIjoxNzIwNjA2MjkwfQ.ir9uMurwGiAFbobWM9P0nxqNwOAgqi_fbrEEoGORPtEYXHTTy8QG7FCoOOw-tW027fSGj3Y5xeD5PzRXNnGPHpJFAgCn6XXK0gQuGbXqMxtQYIO5ox-fnW0sNMMym91IPBWQVotDgEkG0zq2sHraJpzMY31bQuZwBvdAokQ4wRLeMyUHru3m6TA2vkBigsziLBR_f5X8aljVbbegc9S2gvE58azTbh409kYFjUf7hFr1FIZSiVe7SlV0D_DigP8haV92RNlwy-hLd-0pOh-Z9K9pDV8o6YXCE9baqdgmHW0pdyDKKWbgq4sEV6pcDyF3X7DEJ9tV1IxSxTDPa2ZQdA'
 *             message:
 *               example: 'Access token successfully refreshed'
 *
 *
 *     LogOutSuccessResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseSuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               example: null
 *             message:
 *               example: 'Successfully logged out'
 *
 */

export type createSessionInput = TypeOf<typeof createSessionSchema>['body'];
