import { Schema, model } from 'mongoose';

const News = new Schema({
  type: String,
  linkProduct: String,
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

export default model('News', News);
