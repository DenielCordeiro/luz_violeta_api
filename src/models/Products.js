import { Schema, model } from 'mongoose';

const ProductsSchema = new Schema({
  id: Number,
  type: String,
  valor: Number,
  name: String,
  description: String,
  groups: String,
  image: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

// eslint-disable-next-line func-names
ProductsSchema.virtual('image_url').get(function () {
  return `http://localhost:3333/files/${this.images}`;
});

export default model('Products', ProductsSchema);
