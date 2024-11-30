import { Schema, model } from 'mongoose';

const NewsletterSchema = new Schema({
  news: {
    firstImage: {
      image: String,
      productId: Number,
    },
    secondImage: {
      image: String,
      productId: Number,
    },
  },
  carousel: {
    firstImage: {
      image: String,
      productId: Number,
    },
    secondImage: {
      image: String,
      productId: Number,
    },
    thrirdImage: {
      image: String,
      productId: Number,
    },
    fourthImage: {
      image: String,
      productId: Number,
    },
    fifthImage: {
      image: String,
      productId: Number,
    },
  },
});

export default model('Newsletter', NewsletterSchema);
