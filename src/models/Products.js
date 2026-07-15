import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductsSchema = new Schema({
	name: String,
	description: String,
	included_items: String,
	warranty: String,
	price: Number,
	stock: Number,
	type: [String],
	category: [String],
	characteristics: [String],
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
},
	{
		timestamps: true,
	});

ProductsSchema.plugin(mongoosePaginate);

export default model('Products', ProductsSchema);
