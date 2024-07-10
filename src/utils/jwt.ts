import jwt from 'jsonwebtoken';
import config from 'config';
import type { PrivateKeyName, PublicKeyName } from '../types/jwtKeyNames';
import log from '../utils/logger';
import { getSessionByID } from '../services/auth.service';

/**
 * Signs a JSON Web Token (JWT) using the specified private key and options.
 *
 * @param payload - The data to be included in the JWT payload.
 * @param keyName - The name of the private key to be used for signing the JWT.
 * @param options - Optional JWT sign options to be used when creating the token.
 * @returns The signed JWT string.
 * @throws Will throw an error if the JWT signing process fails.
 */
export function signJWT(
  payload: object,
  keyName: PrivateKeyName,
  options?: jwt.SignOptions | undefined,
) {
  try {
    const signingKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');

    const token = jwt.sign(payload, signingKey, {
      ...(options && options),
      algorithm: 'RS256',
    });

    return token;
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, `Error while signing JWT: `);
    } else {
      log.error(error, `Something went wrong signing JWT: `);
    }
    throw error;
  }
}

/**
 * Verifies a JSON Web Token (JWT) using the specified public key and checks the session validity.
 *
 * @template T - A type that extends an object with a sessionID property.
 * @param {string} token - The JWT string to be verified.
 * @param {PublicKeyName} keyName - The name of the public key to be used for verifying the JWT.
 * @returns {Promise<T | null>} A promise that resolves to the decoded JWT data if verification is successful and the session is valid, or null if the session is invalid.
 * @throws Will throw an error if the JWT verification process fails.
 */
export async function verifyJWT<T extends { sessionID: string }>(
  token: string,
  keyName: PublicKeyName,
): Promise<T | null> {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');

  try {
    const decodedData = jwt.verify(token, publicKey) as T;

    const session = await getSessionByID(decodedData.sessionID);
    if (!session || !session.isValid) {
      return null;
    }

    return decodedData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, `Error while verifying JWT: `);
    } else {
      log.error(error, `Something went wrong verifying JWT: `);
    }
    throw error;
  }
}
