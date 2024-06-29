import { Schema, model } from 'mongoose';

const ProductsSchema = new Schema({
  id: Number,
  user: String,
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
});

export default model('Products', ProductsSchema);
