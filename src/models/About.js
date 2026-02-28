import { Schema, model } from 'mongoose';

const ParagraphSchema = new Schema({
    _id: Number,
    phrases: String,
});

const SectionSchema = new Schema({
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