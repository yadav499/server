const Category = require('../models/Category');
const SubCategory=require('../models/SubCategory');
const BlogPost=require('../models/BlogPost')

// Create a new category
const createCategorycontroller = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all categories
const getCategoriescontroller = async (req, res) => {
  try {
    const categories = await Category.find().populate('subCategoryIds');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get subcategories of category using category id
const getsubcatofcatcontroller = async (req, res) => {
  try {
    // Find the category by ID and populate the subCategoryIds field
    const category = await Category.findById(req.params.id).populate('subCategoryIds');
    
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Return the populated subcategories
    res.status(200).json(category.subCategoryIds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// get all posts of category
const getPostsByCategoryId = async (req, res) => {
  try {
    // Step 1: Fetch the category by ID
    const category = await Category.findById(req.query.categoryId).exec();
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Step 2: Fetch the subcategories by the subCategoryIds in the category
    const subCategories = await SubCategory.find({ '_id': { $in: category.subCategoryIds } }).exec();

    // Step 3: Aggregate all blogPostIds from the subcategories
    const allPostIds = subCategories.reduce((postIds, subCategory) => {
      return postIds.concat(subCategory.blogPostIds);
    }, []);

    // Optional: Remove duplicate post IDs
    const uniquePostIds = [...new Set(allPostIds)];

    // Step 4: Fetch the blog posts by the aggregated post IDs
    const blogPosts = await BlogPost.find({ '_id': { $in: uniquePostIds } }).exec();

    // Respond with the list of blog posts
    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single category by ID
const getCategoryByIdcontroller = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('subCategoryIds');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category
const updateCategorycontroller = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a category
const deleteCategorycontroller = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports={
    createCategorycontroller,
    getCategoriescontroller,getsubcatofcatcontroller,getPostsByCategoryId,
    getCategoryByIdcontroller,updateCategorycontroller,deleteCategorycontroller
}