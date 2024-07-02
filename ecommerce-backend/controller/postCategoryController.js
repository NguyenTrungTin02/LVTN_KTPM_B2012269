const PostCategory = require("../models/postCategoryModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

//Thêm loại bài viết
const createPostCategory = asyncHandler(async(req, res)=>{
    try{
        const newPostCategory = await PostCategory.create(req.body);
        res.json(newPostCategory);
    }catch(error){
        throw new Error(error)
    }
});

//Cập nhật loại bài viết
const updatePostCategory = asyncHandler(async(req, res)=>{
    const {id}=req.params;
    try{
        const updatePostCategory = await PostCategory.findByIdAndUpdate(id,req.body,{new:true,});
        res.json(updatePostCategory);
    }catch(error){
        throw new Error(error)
    }
});

//Xóa loại bài viết
const deletePostCategory = asyncHandler(async(req, res)=>{
    const {id}=req.params;
    try{
        const deletePostCategory = await PostCategory.findByIdAndDelete(id);
        res.json(deletePostCategory);
    }catch(error){
        throw new Error(error)
    }
});



//Lấy loại bài viết
const getPostCategory = asyncHandler(async(req, res)=>{
    const {id}=req.params;
    try{
        const getPostCategory = await PostCategory.findById(id);
        res.json(getPostCategory);
    }catch(error){
        throw new Error(error)
    }
});


//Lấy tất cả loại bài viết
const getAllPostCategory = asyncHandler(async(req, res)=>{
    try{
        const getAllPostCategory = await PostCategory.find();
        res.json(getAllPostCategory);
    }catch(error){
        throw new Error(error)
    }
});



module.exports={
    createPostCategory,
    updatePostCategory,
    deletePostCategory,
    getPostCategory,
    getAllPostCategory
};