import type { Session } from './session';

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  iat: number;
  exp: number;
};

export type UserWithSession = User & Pick<Session, 'sessionID'>;
