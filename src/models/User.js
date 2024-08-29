/* eslint-disable no-unused-vars */
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: Number,
  name: String,
  email: String,
  cellphone: String,
  password: String,
  postalCode: String,
  state: String,
  city: String,
  street: String,
  neighborhood: String,
  houseNumber: Number,
  productCart: {},
});

export default model('User', UserSchema);
