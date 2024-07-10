import { getModelForClass, prop } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { User } from '../models/user.model';

export class Session {
  @prop({ ref: () => User })
  userID: Ref<User>;

  @prop({ default: true })
  isValid: boolean;
}

const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});

export default SessionModel;
