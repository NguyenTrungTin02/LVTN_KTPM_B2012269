const express = require("express");
const { 
    createPostCategory, 
    updatePostCategory, 
    deletePostCategory,
    getPostCategory,
    getAllPostCategory
} = require("../controller/postCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-post-category",authMiddleware,isAdmin,createPostCategory);
router.put("/update-post-category/:id",authMiddleware,isAdmin,updatePostCategory);
router.delete("/delete-post-category/:id",authMiddleware,isAdmin,deletePostCategory);
router.get("/get-post-category/:id",getPostCategory);
router.get("/get-all-post-category",getAllPostCategory);



module.exports=router;