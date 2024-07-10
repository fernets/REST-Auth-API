import { ModelOptions, Severity, getModelForClass, index, pre, prop } from '@typegoose/typegoose';
import type { DocumentType } from '@typegoose/typegoose';
import argon2 from 'argon2';
import { randomUUID } from 'crypto';
import log from '../utils/logger';

export const privateFields = [
  'password',
  '__v',
  'verificationCode',
  'passwordResetCode',
  'isVerified',
];

@pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;

    next();
  } catch (error: unknown) {
    {
      if (error instanceof Error) {
        log.error(error.message, 'Error hashing the password: ');
      } else {
        log.error(error, 'Something went wrong hashing the password: ');
      }
      this.invalidate('password', 'Error hashing the password');
      next();
    }
  }
})
@index({ email: 1 })
@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ required: true, lowercase: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => randomUUID() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ required: true, default: false })
  isVerified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(error.message, 'Could not validate password: ');
      } else {
        log.error(error, 'Something went wrong validating password: ');
      }
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
