import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

const TypeSchema = new Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

const ProductsSchema = new Schema({
    name: String,
    description: String,
    included_items: String,
    warranty: String,
    price: Number,
    stock: Number,
    type: { type: Schema.Types.ObjectId, ref: 'Type' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    characteristics: String,
    deadline: Date,
    packaging: {
        weight: Number,
        height: Number,
        width: Number,
        length: Number,
    },
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
}, {
    timestamps: true,
});

ProductsSchema.plugin(mongoosePaginate);

const Products = model('Products', ProductsSchema);
export const Category = model('Category', CategorySchema);
export const Type = model('Type', TypeSchema);

export default Products;