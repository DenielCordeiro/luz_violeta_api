import { Schema, model } from 'mongoose';

const ProductsSchema = new Schema({
  name: String,
  description: String,
  valor: Number,
  type: String,
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
});

export default model('Products', ProductsSchema);
