/* eslint-disable import/no-extraneous-dependencies */
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: Number,
  email: String,
  password: String,
  name: String,
  address: String,
});

export default model('User', UserSchema);
