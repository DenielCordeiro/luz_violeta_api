import { model, Schema } from 'mongoose';

const Review = new Schema({
	userName: String,
	review: String,
	stars: Number,
	filledStars: Number,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default model('Review', Review);
