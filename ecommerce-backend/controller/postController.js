const Post = require("../models/postModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const cloudinaryUpImg = require("../utils/cloudinary")
const fs = require("fs")

//Tạo bài viết
const createPost = asyncHandler(async(req, res)=>{
    try{
        const newPost = await Post.create(req.body);
        res.json(newPost);
    }catch(error){
        throw new Error(error);
    }
})


//Cập nhật bài viết
const updatePost = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try{
        const updatePost = await Post.findByIdAndUpdate(id,req.body,{new: true,});
        res.json(updatePost);
    }catch(error){
        throw new Error(error);
    }
})

//Lấy bài viết
const getPost = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try{
        const getPost = await Post.findById(id).populate("like").populate("dislike");
        const views=await Post.findByIdAndUpdate(id,
        {
            $inc: {views: 1},
        },
        {new : true}
        )
        res.json(getPost);
    }catch(error){
        throw new Error(error);
    }
})


//Lấy tất cả bài viết

const getAllPost = asyncHandler(async(req, res)=>{
    try{
        const getAllPost = await Post.find();
        res.json(getAllPost);
    }catch(error){
        throw new Error(error);
    }

})


//Xóa bài viết

const deletePost = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try{
        const deletePost = await Post.findByIdAndDelete(id);
        res.json(deletePost);
    }catch(error){
        throw new Error(error);
    }

})

const likePost = asyncHandler(async(req, res) => {
    const { postID } = req.body;
    validateMongoDbId(postID);

    const userIdLogin = req?.user?._id;
    console.log("Id:", userIdLogin);

    // Tìm bài viết dựa trên postID
    const post = await Post.findById(postID);

    const isLiked = post.isLiked;
    const isDisliked = post.dislike.includes(userIdLogin);

    // Nếu đã dislike trước đó, loại bỏ dislike và đặt isDisliked thành false
    if (isDisliked) {
        await Post.findByIdAndUpdate(postID,
            { $pull: { dislike: userIdLogin }, isDisliked: false },
            { new: true }
        );
    }

    // Nếu đã like trước đó, loại bỏ like
    if (isLiked) {
        const updatedPost = await Post.findByIdAndUpdate(postID,
            { $pull: { like: userIdLogin }, isLiked: false },
            { new: true }
        );
        return res.json(updatedPost);
    } else {
        // Nếu chưa like trước đó, thêm like
        const updatedPost = await Post.findByIdAndUpdate(postID,
            { $addToSet: { like: userIdLogin }, isLiked: true },
            { new: true }
        );
        return res.json(updatedPost);
    }
});

//Không thích bài viết
const dislikePost = asyncHandler(async(req, res) => {
    const { postID } = req.body;
    validateMongoDbId(postID);

    const userIdLogin = req?.user?._id;
    console.log("Id:", userIdLogin);

    // Tìm bài viết dựa trên postID
    const post = await Post.findById(postID);
    if (!post) {
        return res.status(404).json({ error: "Bài viết không tồn tại." });
    }

    const isDisliked = post.isDisliked;
    const isLiked = post.like.includes(userIdLogin);

    // Nếu đã like trước đó, loại bỏ like và đặt isLiked thành false
    if (isLiked) {
        await Post.findByIdAndUpdate(postID,
            { $pull: { like: userIdLogin }, isLiked: false },
            { new: true }
        );
    }

    // Nếu đã dislike trước đó, loại bỏ dislike
    if (isDisliked) {
        const updatedPost = await Post.findByIdAndUpdate(postID,
            { $pull: { dislike: userIdLogin }, isDisliked: false },
            { new: true }
        );
        return res.json(updatedPost);
    } else {
        // Nếu chưa dislike trước đó, thêm dislike
        const updatedPost = await Post.findByIdAndUpdate(postID,
            { $addToSet: { dislike: userIdLogin }, isDisliked: true },
            { new: true }
        );
        return res.json(updatedPost);
    }
});



const upLoadImgs = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try {
        const uploader = (path) => cloudinaryUpImg(path,"images");
        const urls = [];
        const files = req.files;
        for(const file of files){
            const {path} = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            
        }

        const findPost = await Post.findByIdAndUpdate(
            id,{
                images: urls.map((file)=>{
                    return file;
    
                })
            },{
                new : true
            }
        )
        res.json(findPost)
    } catch (error) {
        throw new Error(error)
    }
})





module.exports={
    createPost,
    updatePost,
    getPost,
    getAllPost,
    deletePost,
    likePost,
    dislikePost,
    upLoadImgs
}
