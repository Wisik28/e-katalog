const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  description: {
    type: String,
    trim: true,
  },
  material: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  sizes: {
    type: [String],
    default: [],
  },
  image: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', ProductSchema);
