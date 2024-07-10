import { connect } from 'mongoose';
import config from 'config';
import log from '../utils/logger';

/**
 * Establishes a connection to the MongoDB database using the URI specified in the configuration.
 *
 * This function attempts to connect to the database and logs the result. If the connection
 * is successful, it logs an info message. If it fails, it logs an error message and exits
 * the process.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the connection is established successfully.
 * @throws {Error} If the connection fails, the function logs the error and exits the process.
 */
const connectToDB = async (): Promise<void> => {
  const MONGODB_URI = config.get<string>('mongoDBUri');

  try {
    await connect(MONGODB_URI);
    log.info('Connected to DB');
  } catch (error: unknown) {
    if (error instanceof Error) {
      log.error(error.message, 'Could not connect to DB: ');
    } else {
      log.error(error, 'Something went wrong connecting to DB: ');
    }
    process.exit(1);
  }
};

export default connectToDB;
