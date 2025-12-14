import { Schema, model } from 'mongoose';
import User from './User.js';

const SaleSchema = new Schema({
  shipping: {
    name: String,
    postalCode: Number,
    price: Number,
  },
  sold: Boolean,
  productsQuantity: Number,
  finalValue: Number,
  user: User,
  products: [],
});

export default model('Sale', SaleSchema);
