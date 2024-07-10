import { createTransport, getTestMessageUrl, SendMailOptions } from 'nodemailer';
import config from 'config';
import type { SMTP } from '../types/smtp';
import log from '../utils/logger';

// async function createTestCredentials() {
//   const credentials = await nodemailer.createTestAccount();
//   console.log({ credentials });
// }

// createTestCredentials();

const SMTP_CONFIG = config.get<SMTP>('smtp');

const transporter = createTransport({
  ...SMTP_CONFIG,
  auth: { user: SMTP_CONFIG.user, pass: SMTP_CONFIG.pass },
});

/**
 * Sends an email using the configured SMTP transporter.
 *
 * This function attempts to send an email with the provided options. If successful,
 * it logs a preview URL for the sent message. If an error occurs during sending,
 * it logs the error message.
 *
 * @param payload - The email options to be used for sending the email.
 *                  This should be an object conforming to the SendMailOptions interface
 *                  from nodemailer, which includes properties like 'from', 'to', 'subject', and 'text'.
 *
 * @returns A Promise that resolves to void. The function doesn't return any value directly,
 *          but it performs side effects (sending email and logging) asynchronously.
 *
 * @throws This function doesn't throw errors directly, but logs them if they occur during email sending.
 */
async function sendEmail(payload: SendMailOptions): Promise<void> {
  transporter.sendMail(payload, (error, info) => {
    if (error) {
      log.error(error.message, 'Error sending email: ');
      return;
    } else {
      log.info(`Preview URL: ${getTestMessageUrl(info)}`);
    }
  });
}

export default sendEmail;
