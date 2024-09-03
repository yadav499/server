const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for blog posts
const blogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,  // Restrict title length
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,  // This will store the rich text content including image references
  },
  summary: {
    type: String,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
    lowercase: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    uppercase:true,
  },
  category: {
    type: String, 
    required: true,
    trim:true,
  },
  subCategory: {
    type: String, 
    required: true,
    trim:true,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',  // Assuming you have a Comment model
  }],
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  coverImage: {
    type: String,  // URL or path to the cover image
    trim: true,
  },
  metadata: {
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,  // Automatically handles createdAt and updatedAt fields
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
