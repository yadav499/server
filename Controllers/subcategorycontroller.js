const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');
const BlogPost = require('../models/BlogPost');

// Create a new subcategory
const createsubcatcontroller = async (req, res) => {
    try {
      const { name, categoryName } = req.body;
  
      // 1. Create a new subcategory
      const newSubCategory = new SubCategory({
        name,
        categoryName,
      });
  
      const savedSubCategory = await newSubCategory.save();
  
      // 2. Find the category and update it
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // 3. Add the subcategory ID to the category's subCategoryIds array
      category.subCategoryIds.push(savedSubCategory._id);
      await category.save();
  
      // Respond with the created subcategory and updated category
      res.status(201).json({
        message: 'Subcategory created and added to category successfully',
        subCategory: savedSubCategory,
        updatedCategory: category,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

  // get all posts of particular sub category
  
const getPostsBySubCategoryId = async (req, res) => {
  try {
    // Step 1: Fetch the subcategory by ID
    const subCategory = await SubCategory.findById(req.query.subCategoryId).exec();
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    // Step 2: Fetch the blog posts by the blogPostIds in the subcategory
    const blogPosts = await BlogPost.find({ '_id': { $in: subCategory.blogPostIds } }).exec();

    // Respond with the list of blog posts
    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
  
  // Get all subcategories
  const getallsubcatcontroller =async (req, res) => {
    try {
      const subCategories = await SubCategory.find();
      res.json(subCategories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  // Get a specific subcategory by ID
const getsubcatbyidcontroller = async (req, res) => {
    try {
      const subCategory = await SubCategory.findById(req.params.id);
      if (!subCategory) return res.status(404).json({ error: 'SubCategory not found' });
      res.json(subCategory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  // Update a specific subcategory by ID
 const updatesubcatbyidcontroller = async (req, res) => {
    try {
      const { name, blogPostIds = [] } = req.body; // Default blogPostIds to empty array if not provided
      const subCategory = await SubCategory.findByIdAndUpdate(
        req.params.id,
        { name, blogPostIds },
        { new: true, runValidators: true }
      );
      if (!subCategory) return res.status(404).json({ error: 'SubCategory not found' });
      res.json(subCategory);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  
  // Delete a specific subcategory by ID
  const deletesubcatbyidcontroller = async (req, res) => {
    try {
      const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
      if (!subCategory) return res.status(404).json({ error: 'SubCategory not found' });
  
      // Optionally remove the subCategory ID from the related category
      await Category.updateMany(
        { blogPostIds: subCategory._id },
        { $pull: { blogPostIds: subCategory._id } }
      );
  
      res.json({ message: 'SubCategory deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }



  module.exports={
    createsubcatcontroller,
    getallsubcatcontroller,getPostsBySubCategoryId,
    getsubcatbyidcontroller,updatesubcatbyidcontroller,deletesubcatbyidcontroller
}