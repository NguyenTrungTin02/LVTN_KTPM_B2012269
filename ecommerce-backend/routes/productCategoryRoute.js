const express = require("express");
const { 
    createProductCategory, 
    updateProductCategory, 
    deleteProductCategory,
    getProductCategory,
    getAllProductCategory
} = require("../controller/productCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploader = require('../config/cloudinary.config')

router.post("/create-product-category",authMiddleware,isAdmin,uploader.fields
        ([{name:'thumb',maxCount:1}]),createProductCategory);
router.put("/update-product-category/:id",authMiddleware,isAdmin,
        uploader.fields([{name:'thumb',maxCount:1}]),updateProductCategory);
router.delete("/delete-product-category/:id",authMiddleware,isAdmin,deleteProductCategory);
router.get("/get-product-category/:id",getProductCategory);
router.get("/get-all-product-category",getAllProductCategory);



module.exports=router;