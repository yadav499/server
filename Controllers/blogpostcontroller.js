const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost'); 
const SubCategory = require('../models/SubCategory'); 
const Category = require('../models/Category')


// Define the route for creating a blog post
const createBlogPostController = async (req, res) => {


  function trimSummary(summary) {
    if (summary.length > 150) {
        return summary.slice(0, 150) + '...';
    }
    return summary+'...';
}

  try {
    const {
      title,
      slug,
      content,
      summary,
      tags,
      author,
      category,
      subCategory,
      coverImage,
      isPublished,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !content || !author || !category || !subCategory) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    // Create a new blog post object
    const newBlogPost = new BlogPost({
      title,
      slug,
      content,
      summary:trimSummary(summary),
      tags, // Handle tags
      author: author.toUpperCase(), // Ensure author name is in uppercase
      category: category.trim(), // Trim whitespace from category
      subCategory: subCategory.trim(), // Trim whitespace from subCategory
      coverImage,
      isPublished,
    });

    // Save the blog post to the database
    const savedBlogPost = await newBlogPost.save();

    // Update the sub-category with the new blog post ID
    if (subCategory) {
      await SubCategory.findOneAndUpdate(
        { name: subCategory.trim() }, // Assuming you query by subCategory name or adjust as necessary
        { $push: { blogPostIds: savedBlogPost._id } }, // Push the new blog post ID to the blogPostIds array
        { new: true } // Return the updated document
      );
    }

    // Return the saved blog post with a success message
    res.status(201).json({
      message: 'Blog post created successfully',
      blogPost: savedBlogPost,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      message: 'Error creating blog post',
      error: error.message,
    });
  }
};

// edit blog post controller
// const editBlogPostController = async (req, res) => {
//   try {
//     const { postId } = req.params; // Extract ID from request parameters
//     const {
//       title,
//       slug,
//       content,
//       summary,
//       tags,
//       author,
//       category,
//       subCategory,
//       coverImage,
//       isPublished
//     } = req.body;

//     // Validate required fields
//     if (!postId) {
//       return res.status(400).json({
//         message: 'Blog post ID is required',
//       });
//     }

//     // Find and update the blog post
//     const updatedBlogPost = await BlogPost.findByIdAndUpdate(
//       postId,
//       {
//         title,
//         slug,
//         content,
//         summary,
//         tags,
//         author: author ? author.toUpperCase() : undefined, // Ensure author name is in uppercase if provided
//         category: category ? category.trim() : undefined, // Trim whitespace from category if provided
//         subCategory: subCategory ? subCategory.trim() : undefined, // Trim whitespace from subCategory if provided
//         coverImage,
//         isPublished
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedBlogPost) {
//       return res.status(404).json({
//         message: 'Blog post not found',
//       });
//     }

//     // Update the sub-category if it has changed
//     if (subCategory) {
//       // Find the previous sub-category and remove the blog post ID if it exists
//       const previousSubCategory = await SubCategory.findOne({
//         blogPostIds: postId
//       });
      
//       if (previousSubCategory) {
//         await SubCategory.findByIdAndUpdate(
//           previousSubCategory._id,
//           { $pull: { blogPostIds: postId } } // Remove the blog post ID from the previous subCategory
//         );
//       }

//       // Add the blog post ID to the new sub-category
//       await SubCategory.findOneAndUpdate(
//         { name: subCategory.trim() }, // Query by new subCategory name
//         { $addToSet: { blogPostIds: postId } }, // Add the blog post ID to the blogPostIds array if not already present
//         { new: true } // Return the updated document
//       );
//     }

//     // Return the updated blog post with a success message
//     res.status(200).json({
//       message: 'Blog post updated successfully',
//       blogPost: updatedBlogPost,
//     });
//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     res.status(500).json({
//       message: 'Error updating blog post',
//       error: error.message,
//     });
//   }
// };

const editBlogPostController = async (req, res) => {
  try {
    const { postId } = req.params; // Extract ID from request parameters
    const {
      title,
      slug,
      content,
      summary,
      tags,
      author,
      category,
      subCategory,
      coverImage,
      isPublished
    } = req.body;

    // Validate required fields
    if (!postId) {
      return res.status(400).json({
        message: 'Blog post ID is required',
      });
    }

    // Find the existing blog post
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({
        message: 'Blog post not found',
      });
    }

    // Build the update object with only non-empty fields
    const updateFields = {};

    // function to trim summry to 150 lenght 
    function trimSummary(summary) {
      if (summary.length > 150) {
          return summary.slice(0, 150) + '...';
      }
      return summary+'...';
  }


    if (title !== undefined && title.trim() !== '') updateFields.title = title;
    if (slug !== undefined && slug.trim() !== '') updateFields.slug = slug;
    if (content !== undefined && content.trim() !== '') updateFields.content = content;
    if (summary !== undefined && summary.trim() !== '') updateFields.summary = trimSummary(summary);

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        // Ensure tags is an array of trimmed strings
        updateFields.tags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
      } else if (typeof tags === 'string') {
        // If tags is a comma-separated string, convert it to an array
        updateFields.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    if (author !== undefined && author.trim() !== '') updateFields.author = author.toUpperCase(); // Ensure uppercase
    if (category !== undefined && category.trim() !== '') updateFields.category = category.trim(); // Trim whitespace
    if (subCategory !== undefined && subCategory.trim() !== '') updateFields.subCategory = subCategory.trim(); // Trim whitespace
    if (coverImage !== undefined && coverImage.trim() !== '') updateFields.coverImage = coverImage;
    if (isPublished !== undefined) updateFields.isPublished = isPublished; // This field can be boolean and thus does not need trim check

    // Perform the update using $set to ensure only provided fields are updated
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      postId,
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    if (!updatedBlogPost) {
      return res.status(404).json({
        message: 'Blog post not found',
      });
    }

    // Update the sub-category if it has changed
    if (subCategory) {
      // Find the previous sub-category and remove the blog post ID if it exists
      const previousSubCategory = await SubCategory.findOne({
        blogPostIds: postId
      });
      
      if (previousSubCategory) {
        await SubCategory.findByIdAndUpdate(
          previousSubCategory._id,
          { $pull: { blogPostIds: postId } } // Remove the blog post ID from the previous subCategory
        );
      }

      // Add the blog post ID to the new sub-category
      await SubCategory.findOneAndUpdate(
        { name: subCategory.trim() }, // Query by new subCategory name
        { $addToSet: { blogPostIds: postId } }, // Add the blog post ID to the blogPostIds array if not already present
        { new: true } // Return the updated document
      );
    }

    // Return the updated blog post with a success message
    res.status(200).json({
      message: 'Blog post updated successfully',
      blogPost: updatedBlogPost,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      message: 'Error updating blog post',
      error: error.message,
    });
  }
};


// delete blog post controller
const deleteBlogPost = async (req, res) => {
  const { id } = req.params; // Blog post ID passed as a URL parameter
  
  try {
    // Step 1: Find the blog post to be deleted
    const blogPost = await BlogPost.findById(id).exec();
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    const { subCategory: subCategoryName, category: categoryName } = blogPost;
    
    // Step 2: Delete the blog post
    await BlogPost.findByIdAndDelete(id).exec();
    
    // Step 3: Update the subcategory
    if (subCategoryName) {
      const subCategoryDoc = await SubCategory.findOne({ name: subCategoryName }).exec();
      
      if (subCategoryDoc) {
        // Remove the blog post ID from the subcategory's blogPostIds array
        subCategoryDoc.blogPostIds.pull(id);
        await subCategoryDoc.save();
        
        // If no blog posts are left in this subcategory, delete the subcategory
        if (subCategoryDoc.blogPostIds.length === 0) {
          const subcategoryToBeDeleted=subCategoryDoc._id;
          await SubCategory.findByIdAndDelete(subCategoryDoc._id).exec();
          
          // Step 4: Update the category
          if (categoryName) {
            const categoryDoc = await Category.findOne({ name: categoryName }).exec();
            
            if (categoryDoc) {
              
              if (subcategoryToBeDeleted) {
                // Remove the subcategory ID from the category's subCategoryIds array
                categoryDoc.subCategoryIds.pull(subcategoryToBeDeleted);
                await categoryDoc.save();
                
                // If the category no longer has any subcategories, delete the category
                if (categoryDoc.subCategoryIds.length === 0) {
                  await Category.findByIdAndDelete(categoryDoc._id).exec();
                }
              }
            }
          }
        }
      }
    }
    
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to get a blog post by its slug

const getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid slug' });
  }

  try {
    const post = await BlogPost.findOne({ slug });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Controller function to get a blog post by its id
const getPostById = async (req, res) => {
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }
  try {
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Get 3 recent post
const getRecentPostscontroller = async (req, res) => {
  try {
    // Extract the current post ID from query parameters
    const { currentPostId } = req.query;

    // Fetch 3 recent posts excluding the one with the currentPostId
    const recentPosts = await BlogPost.find({ _id: { $ne: currentPostId } })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .limit(3); // Limit to 3 posts

    // Respond with the recent posts
    res.status(200).json(recentPosts);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching recent posts.' });
  }
};


module.exports={
    createBlogPostController,getPostBySlug,getPostById,editBlogPostController,getRecentPostscontroller,deleteBlogPost
    // getCategoriescontroller,
    // getCategoryByIdcontroller,updateCategorycontroller,deleteCategorycontroller
}