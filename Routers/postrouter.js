const router = require('express').Router()  ;
const blogpostcontroller=require('../Controllers/blogpostcontroller')

router.post('/create',blogpostcontroller.createBlogPostController)
router.get('/getpost/:slug',blogpostcontroller.getPostBySlug)
router.put('/editpost/:postId',blogpostcontroller.editBlogPostController)
router.get('/getrecentpost',blogpostcontroller.getRecentPostscontroller)
router.delete('/deleteblogpost/:id',blogpostcontroller.deleteBlogPost)
router.get('/getpostdetail/:postId',blogpostcontroller.getPostById)
// router.get('/refresh',authcontroller.refershaccesstokencontroller)
// router.post('/logout',authcontroller.logoutController)

module.exports=router;