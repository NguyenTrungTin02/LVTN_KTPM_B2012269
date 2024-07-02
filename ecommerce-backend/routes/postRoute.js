const express = require("express");
const { 
    createPost, 
    updatePost, 
    getPost,
    getAllPost,
    deletePost,
    likePost,
    dislikePost,
    upLoadImgs
} = require("../controller/postController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { upLoadImg, postImgResize } = require("../middlewares/uploadImg");
const router = express.Router();




router.post("/create-post",authMiddleware,isAdmin,createPost);
router.put("/upload/:id",authMiddleware,isAdmin,upLoadImg.array("images",2),postImgResize,upLoadImgs);
router.put("/update-post/:id",authMiddleware,isAdmin,updatePost);
router.get("/get-post/:id",getPost);
router.get("/get-all-post",getAllPost);
router.put("/like",authMiddleware,likePost);
router.put("/dislike",authMiddleware,dislikePost);
router.delete("/delete-post/:id",authMiddleware,isAdmin,deletePost);



module.exports=router;