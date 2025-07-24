/* eslint-disable no-unused-vars */
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  cellphone: String,
  postalCode: String,
  state: String,
  city: String,
  street: String,
  neighborhood: String,
  houseNumber: Number,
  productsCart: {},
});

export default model('User', UserSchema);
