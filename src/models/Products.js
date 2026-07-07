import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductsSchema = new Schema({
  name: String,
  description: String,
  valor: Number,
  type: String,
  category: String,
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
},
{
  timestamps: true,
});

ProductsSchema.plugin(mongoosePaginate);

export default model('Products', ProductsSchema);
