const router = require('express').Router()  ;
const categorycontroller=require('../Controllers/categorycontroller')

router.post('/create',categorycontroller.createCategorycontroller);
router.get('/getcategory',categorycontroller.getCategoriescontroller);
router.get('/getsubcatofcat/:id/subcats',categorycontroller.getsubcatofcatcontroller);
router.get('/getallpost',categorycontroller.getPostsByCategoryId);
// router.get('/refresh',authcontroller.refershaccesstokencontroller)
// router.post('/logout',authcontroller.logoutController)

module.exports=router;