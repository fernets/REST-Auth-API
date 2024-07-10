import { randomUUID } from 'crypto';
import type { Request } from 'express';
import type {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from '../schemas/user.schema';
import type { ApiResponse, UserWithSession } from '../types';
import { createUser, findUserByEmail, findUserByID } from '../services/user.service';
import log from '../utils/logger';
import sendEmail from '../utils/mailer';
import { invalidateSessionsByUserID } from '../services/auth.service';

/**
 * Handles the creation of a new user.
 *
 * This function creates a new user based on the provided input, sends a verification email,
 * and returns an appropriate response. It handles potential errors such as duplicate accounts.
 *
 * @param req - The Express request object containing the user creation input.
 * @param req.body - The body of the request containing the user creation data.
 * @param res - The Express response object for sending the API response.
 *
 * @returns A Promise that resolves to the API response.
 *          - 201 status code if the user is successfully created.
 *          - 409 status code if the account already exists.
 *          - 500 status code for any other errors.
 */
export async function createUserHandler(
  req: Request<Record<string, never>, unknown, CreateUserInput>,
  res: ApiResponse<null>,
) {
  const { body } = req;

  try {
    const user = await createUser(body);

    if (user) {
      await sendEmail({
        from: 'test@example.com',
        to: user.email,
        subject: 'Please verify your email',
        text: `Verification code: ${user.verificationCode}. ID: ${user._id}`,
      });

      return res.status(201).json({
        status: 'success',
        data: null,
        message: 'User successfully created',
        code: 201,
      });
    }

    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Internal server error',
      code: 500,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error creating user: ');
      if ('code' in error && (error as { code: number }).code === 11000) {
        return res.status(409).json({
          status: 'error',
          data: null,
          message: 'Account already exists',
          code: 409,
        });
      }
    }

    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Internal server error',
      code: 500,
    });
  }
}

/**
 * Handles the verification of a user's account.
 *
 * This function attempts to verify a user's account using the provided user ID and verification code.
 * It checks if the user exists, if they're already verified, and if the provided verification code matches.
 * Appropriate responses are sent based on the outcome of these checks.
 *
 * @param req - The Express request object containing the verification input.
 * @param req.params - The parameters from the request URL.
 * @param req.params.userID - The ID of the user to be verified.
 * @param req.params.verificationCode - The verification code to be checked against the user's stored code.
 * @param res - The Express response object for sending the API response.
 *
 * @returns A Promise that resolves to the API response.
 *          - 200 status code if the user is successfully verified or already verified.
 *          - 400 status code if the user doesn't exist or the verification code is invalid.
 *          - 500 status code for any other errors.
 */
export async function verifyUserHandler(req: Request<VerifyUserInput>, res: ApiResponse<null>) {
  const { userID, verificationCode } = req.params;

  try {
    const user = await findUserByID(userID);

    if (!user) {
      log.debug(`User with ID ${userID} does not exist`);
      return res.status(400).json({
        status: 'error',
        data: null,
        message: 'Could not verify user',
        code: 400,
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        status: 'success',
        data: null,
        message: 'User is already verified',
        code: 200,
      });
    }

    if (user.verificationCode === verificationCode) {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({
        status: 'success',
        data: null,
        message: 'User successfully verified',
        code: 200,
      });
    }

    return res.status(400).json({
      status: 'error',
      data: null,
      message: 'Could not verify user',
      code: 400,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error verifying user: ');
    } else {
      log.error(error, 'Something went wrong verifying user: ');
    }

    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Internal server error',
      code: 500,
    });
  }
}

/**
 * Handles the forgot password request for a user.
 *
 * This function processes a forgot password request, generates a password reset code
 * for the user if they exist and are verified, and sends a reset email. For security
 * reasons, it returns the same success message whether the user exists or not.
 *
 * @param req - The Express request object containing the forgot password input.
 * @param req.body - The body of the request containing the user's email.
 * @param req.body.email - The email address of the user requesting a password reset.
 * @param res - The Express response object for sending the API response.
 *
 * @returns A Promise that resolves to the API response.
 *          - 200 status code with a success message if the process completes (whether user exists or not).
 *          - 403 status code if the user exists but is not verified.
 *          - 500 status code for any other errors.
 */
export async function forgotPasswordHandler(
  req: Request<Record<string, never>, unknown, ForgotPasswordInput>,
  res: ApiResponse<null>,
) {
  const message = 'If a user with this email exists, you will receive a password reset email';
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      log.debug(`User with email ${email} does not exist`);
      return res.status(200).json({
        status: 'success',
        data: null,
        message,
        code: 200,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: 'error',
        data: null,
        message: 'User is not verified',
        code: 403,
      });
    }

    const passwordResetCode = randomUUID();
    user.passwordResetCode = passwordResetCode;
    await user.save();

    await sendEmail({
      to: user.email,
      from: 'test@example.com',
      subject: 'Reset your password',
      text: `Password reset code: ${passwordResetCode}. ID: ${user._id}`,
    });

    log.info(`Password reset email sent to ${email}`);

    return res.status(200).json({
      status: 'success',
      data: null,
      message,
      code: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error sending password reset email: ');
    } else {
      log.error(error, 'Something went wrong sending password reset email: ');
    }

    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Internal server error',
      code: 500,
    });
  }
}

/**
 * Handles the password reset process for a user.
 *
 * This function verifies the user's reset code, updates their password,
 * and invalidates all existing sessions for the user.
 *
 * @param req - The Express request object containing reset password input.
 * @param req.params - The parameters from the request URL.
 * @param req.params.userID - The ID of the user resetting their password.
 * @param req.params.passwordResetCode - The reset code to verify against the user's stored code.
 * @param req.body - The body of the request.
 * @param req.body.password - The new password to set for the user.
 * @param res - The Express response object for sending the API response.
 *
 * @returns A Promise that resolves to the API response.
 *          - 200 status code if the password is successfully reset.
 *          - 400 status code if the user doesn't exist or the reset code is invalid.
 *          - 500 status code for any other errors.
 */
export async function resetPasswordHandler(
  req: Request<ResetPasswordInput['params'], unknown, ResetPasswordInput['body']>,
  res: ApiResponse<null>,
) {
  const { userID, passwordResetCode } = req.params;
  const { password } = req.body;

  try {
    const user = await findUserByID(userID);

    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
      return res.status(400).json({
        status: 'error',
        data: null,
        message: 'Bad request',
        code: 400,
      });
    }

    user.passwordResetCode = null;
    user.password = password;
    await user.save();

    await invalidateSessionsByUserID(userID);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Password successfully updated',
      code: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error resetting password: ');
    } else {
      log.error(error, 'Something went wrong resetting password: ');
    }

    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Internal server error',
      code: 500,
    });
  }
}

/**
 * Handles the retrieval of the current user's information.
 *
 * This function attempts to fetch the current user's data from the response locals.
 * If the user is found, it returns their information. If not, it returns an unauthorized error.
 * Any unexpected errors are caught and logged, returning a server error response.
 *
 * @param _ - The Express request object (unused in this function).
 * @param res - The Express response object for sending the API response.
 * @returns A Promise that resolves to the API response.
 *          - 200 status code with the user data if successful.
 *          - 401 status code if the user is not found in res.locals.
 *          - 500 status code for any other errors.
 */
export async function getCurrentUserHandler(_: Request, res: ApiResponse<UserWithSession>) {
  try {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        data: null,
        message: 'Unauthorized',
        code: 401,
      });
    }

    return res.status(200).json({
      status: 'success',
      data: currentUser,
      message: 'User data retrieved successfully',
      code: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Error getting current user: ');
    } else {
      log.error(error, 'Something went wrong getting current user: ');
    }

    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Internal server error',
      code: 500,
    });
  }
}
