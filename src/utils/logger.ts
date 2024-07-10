import { pino } from 'pino';
import dayjs from 'dayjs';

/**
 * Creates a configured Pino logger instance.
 *
 * This function initializes a Pino logger with custom configuration options,
 * including a custom timestamp format and pretty printing for improved readability.
 *
 * @returns {pino.Logger} A configured Pino logger instance with the following settings:
 *   - Base: Excludes the process ID from log output
 *   - Timestamp: Custom format using dayjs (DD-MM-YYYY HH:mm:ss)
 *   - Transport: Uses pino-pretty for colorized and formatted output
 *     - Colorize: Enables colorized output
 *     - TranslateTime: Disables automatic time translation (using custom format instead)
 */
const log = pino({
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format('DD-MM-YYYY HH:mm:ss')}"`,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: false,
    },
  },
});

export default log;
