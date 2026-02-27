import { Schema, model } from 'mongoose';

const ParagraphSchema = new mongoose.Schema({
    _id: Number,
    phrases: String,
});

const SectionSchema = new mongoose.Schema({
    title: String,
    paragraph: [ParagraphSchema],
});

const AboutSchema = new Schema({
    company: SectionSchema,
    businesswoman: SectionSchema,

},
{
  timestamps: true,
});

export default model('About', AboutSchema)