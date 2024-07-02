const express = require('express');
const { 
    createProduct, 
    getAProduct, 
    getAllProduct, 
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
    upLoadImgs,
    uploadImagesProduct,
    addVariant,
    addDiscount,
    deleteRating
} = require('../controller/productController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { upLoadImg, productImgResize } = require('../middlewares/uploadImg');
const uploader= require('../config/cloudinary.config')


const router = express.Router();

router.post("/",authMiddleware,isAdmin,uploader.fields([
    {name:'images',maxCount:10},
    {name: 'thumb',maxCount:1},
    {name: 'model3d',maxCount:1}
]),createProduct);
router.get("/get-a-product/:id",getAProduct);

router.put("/upload/:id",authMiddleware,isAdmin,upLoadImg.array("images",10),productImgResize,upLoadImgs);

router.put("/varriant/:id",authMiddleware,isAdmin,uploader.fields([
    {name: 'images',maxCount:10},
    {name: 'thumb',maxCount:1},
    {name: 'model3d',maxCount:1}
]),addVariant);


router.put("/update-product/:id",authMiddleware,isAdmin,uploader.fields([
    {name: 'images',maxCount:10},
    {name: 'thumb',maxCount:1},
    {name: 'model3d',maxCount:1}
]),updateProduct);


router.put("/add-discount/:id",authMiddleware,isAdmin,addDiscount);

router.delete('/products/:productId/ratings/:ratingId',authMiddleware,isAdmin,deleteRating);


router.delete("/delete-product/:id",authMiddleware,isAdmin,deleteProduct);
router.get("/get-all-product",getAllProduct);
router.put("/wishlist",authMiddleware,addToWishList);
router.put("/rating",authMiddleware,rating);


router.put('/uploadImage/:id',authMiddleware,isAdmin,uploader.array('images',10),uploadImagesProduct)


module.exports = router;