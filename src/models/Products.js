import { Schema, model } from 'mongoose';

const ProductsSchema = new Schema({
  type: String,
  valor: Number,
  name: String,
  description: String,
  groups: String,
  file: {
    name: String,
    size: Number,
    key: String,
    url: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  shipping: {
    name: String,
    postalCode: Number,
    price: Number,
  },
  sale: {
    sold: Boolean,
    userId: Number,
  },
});

export default model('Products', ProductsSchema);
