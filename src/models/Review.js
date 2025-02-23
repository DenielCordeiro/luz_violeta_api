import { model, Schema } from 'mongoose';

const Review = new Schema({
  _id: Number,
  userName: String,
  review: String,
  date: Number,
  stars: Number,
  filledStars: Number,
});

export default model('Review', Review);
