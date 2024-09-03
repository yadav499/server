const router = require('express').Router()  ;
const subcategorycontroller=require('../Controllers/subcategorycontroller')

router.post('/create',subcategorycontroller.createsubcatcontroller);
router.get('/getallpost',subcategorycontroller.getPostsBySubCategoryId);
// router.get('/refresh',authcontroller.refershaccesstokencontroller)
// router.post('/logout',authcontroller.logoutController)

module.exports=router;