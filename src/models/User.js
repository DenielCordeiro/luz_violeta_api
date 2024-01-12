/* eslint-disable no-unused-vars */
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: Number,
  allProducts: {
    product: String,
  },
  email: String,
  password: String,
  name: String,
  address: String,
});

export default model('User', UserSchema);
