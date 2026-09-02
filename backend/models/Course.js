import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '10 mins' },
})

const sectionSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, required: true },
  lectures: { type: Number, default: 4 },
  duration: { type: String, default: '45 m' },
  open: { type: Boolean, default: false },
  items: [itemSchema],
})

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A course must have a title'],
      trim: true,
    },
    subtitle: { type: String },
    headings: { type: String },
    description: { type: String, required: [true, 'A course must have a description'] },
    category: { type: String, default: 'Web Development' },
    price: { type: Number, required: [true, 'A course must have a price'], default: 0 },
    originalPrice: { type: String, default: '$19.09' },
    discount: { type: String, default: '50% off' },
    daysLeft: { type: String, default: '5 days left at this price!' },
    badge: { type: String, default: 'BEST SELLER' },
    thumbnail: { type: String, default: null },
    instructor: { type: String, default: 'Richard James' },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 122 },
    studentCount: { type: Number, default: 25 },
    totalSections: { type: Number, default: 22 },
    totalLectures: { type: Number, default: 34 },
    totalDuration: { type: String, default: '27h 25m' },
    isLive: { type: Boolean, default: true },
    earnings: { type: Number, default: 150 },
    sections: [sectionSchema],
    includes: [{ type: String }],
    educator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

const Course = mongoose.model('Course', courseSchema)
export default Course
