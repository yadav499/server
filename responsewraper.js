const router = require('express').Router()  ;
const Usercontroller=require('../Controllers/Usercontroller')

router.post('/signup',Usercontroller.signupcontroller)
router.post('/login',Usercontroller.logincontroller)
router.get('/isadmincheck/:userId',Usercontroller.isadmincheck)
// router.put('/editpost/:postId',blogpostcontroller.editBlogPostController)
// router.get('/getrecentpost',blogpostcontroller.getRecentPostscontroller)


module.exports=router;