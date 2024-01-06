/* eslint-disable no-unused-vars */
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: Number,
  email: String,
  password: String,
  name: String,
  address: String,
  products: {
    products_id: Number,
  },
});

export default model('User', UserSchema);
