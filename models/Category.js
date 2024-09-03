const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategoryIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'SubCategory', default: [] }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
