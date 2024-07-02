const Product = require('../models/productModel');
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/userModel");
const cloudinaryUpImg = require("../utils/cloudinary")

const uniqid = require("uniqid")

const fs = require("fs");
const { response } = require('express');

//Tạo sản phẩm
const createProduct = asyncHandler(async (req, res) =>{
    const {title, price, description, brand, category,color,
        parameter,guarantee} = req.body
    const thumb= req.files?.thumb[0]?.path
    const model3d= req.files?.model3d[0]?.path
    const images = req.files?.images.map(el=>el.path)
    if(!(title && price && description && brand && category && color)) throw new Error("Missing inputs")
  
    req.body.totalDiscount= price
    req.body.slug=slugify(req.body.title);
    if(thumb) req.body.thumb=thumb

    if(images) req.body.images=images
    if(model3d) req.body.model3d=model3d

    const newProduct = await Product.create(req.body);
    res.status(200).json({
        success: newProduct ? true : false,
        mes: newProduct ? "Tạo sản phẩm thành công" : "Tạo sản phẩm thất bại"
    });

   
    
});

//Lấy ra một sản phẩm

const getAProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id).populate({
            path: 'ratings',
            populate: {
                path: 'postedby',
                select:'name avatar'
            }
        });
        res.json({
            success: true,
            productData:findProduct
        });
    }catch(error){
        throw new Error(error);
    }
})


//Lấy tất cả sản phẩm
// const getAllProduct = asyncHandler(async(req, res)=>{
//     try{

//         //Lọc
//         const queryObj = {...req.query};
//         const excludeFields = ["page", "sort","limit","fields"];
//         excludeFields.forEach((el) => delete queryObj[el]);
        
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        

//         let query = Product.find(JSON.parse(queryStr));

        

//         //Sắp xếp
//         if(req.query.sort){
//             const sortBy = req.query.sort.split(",").join(" ");
//             console.log(sortBy)
//             query = query.sort(sortBy);
//         }else{
//             query = query.sort("-createAt");
//         }

//         //Giới hạn các trường

//         if(req.query.fields){
//             const fields = req.query.fields.split(",").join(" ");
//             query = query.select(fields);
//         } else{
//             query = query.select('-__v');
//         }


       

//         //phân trang

//         const page = req.query.page;
//         const limit = req.query.limit;
//         const  skip = (page -1 ) * limit;
//         query = query.skip(skip).limit(limit);
//         if(req.query.page){
//             const productCount = await Product.countDocuments();
//             if(skip>= productCount) throw new Error("Trang này không tồn tại")
//         }


//         const product = await query;
//         res.json(
//             {
//                 success: product? true: false,
//                 products: product ? product :'K'
//             });
//     }catch(error){
//         throw new Error(error)
//     }
// })



const getAllProduct = asyncHandler(async (req, res) => {
    //Lọc
    const queries = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchedEL) => `$${matchedEL}`);

    const formateQueries = JSON.parse(queryString);
    let colorQueryObject = {};
    if (queries?.title) formateQueries.title = { $regex: queries.title, $options: 'i' };
    if (queries?.category) formateQueries.category = { $regex: queries.category, $options: 'i' };

    if (queries?.color) {
        delete formateQueries.color;
        const colorArr = queries.color?.split(',');
        const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }));
        colorQueryObject = { $or: colorQuery };
    }

    let queryObject={}

    if(queries?.q){
        delete formateQueries.q
        queryObject={ $or:[
            {color: {$regex: queries.q, $options:'i'}},
            {title: {$regex: queries.q, $options:'i'}},
            {category: {$regex: queries.q, $options:'i'}},
            {brand: {$regex: queries.q, $options:'i'},}
        ]}
    }

    const qr = { ...colorQueryObject, ...formateQueries,...queryObject };
    let queryCommand = Product.find(qr);

    //Sắp xếp
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
    }

    //Giới hạn các trường
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
    }

    //phân trang
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 8;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    try {
        const response = await queryCommand.exec();
        const counts = await Product.countDocuments(qr);
        return res.status(200).json({
            success: response ? true : false,
            products: response ? response : 'Cannot get products',
            counts
        });
    } catch (err) {
        throw new Error(err.message);
    }
});


//Cập nhật sản phẩm

const updateProduct = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    const files = req?.files
    console.log(req.body)
    if(files?.thumb){
        req.body.thumb = files?.thumb[0].path
       
    }

    if(files?.model3d){
        req.body.model3d = files?.model3d[0].path
       
    }
    console.log(req.body.images = files?.images?.map(el=>el.path))
  
    if(files?.images) {req.body.images = files?.images?.map(el=>el.path)}
   
    if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }

     
    let  updateProduct = await Product.findOneAndUpdate({_id:id}, req.body,
            { new: true,
        });

        if (!updateProduct) {
            const variant = await Product.findOne({ "varriants._id": id }, { "varriants.$": 1 });

            
            if(!files?.images){
                req.body.images = variant?.varriants[0]?.images
            }
           
            req.body.sku=variant?.varriants[0]?.sku
            updateProduct = await Product.findOneAndUpdate(
                { "varriants._id": id },
                { $set: { "varriants.$": req.body } },
                { new: true }
            );
        }

        res.status(200).json({
            success: updateProduct ? true : false,
            mes: updateProduct ? "Cập nhật sản phẩm thành công" : "Cập nhật phẩm thất bại"
        });
       
   
});

// const updateProduct = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const files = req?.files;

//     try {
//         // Lấy dữ liệu sản phẩm cần cập nhật
//         let product = await Product.findById(id);

//         if (!product) {
//             return res.status(404).json({ success: false, mes: 'Sản phẩm không tồn tại' });
//         }

//         // Cập nhật thông tin cơ bản của sản phẩm
//         if (req.body.title) {
//             req.body.slug = slugify(req.body.title);
//         }
//         if (files?.thumb) {
//             req.body.thumb = files.thumb[0].path;
//         }
//         if (files?.images) {
//             req.body.images = files.images.map(el => el.path);
//         }

//         // Kiểm tra nếu có yêu cầu cập nhật biến thể
//         if (req.body.varriants) {
//             // Duyệt qua từng biến thể được gửi trong yêu cầu
//             req.body.varriants.forEach((variant, index) => {
//                 // Kiểm tra nếu chỉ số của biến thể tồn tại trong mảng variants của sản phẩm
//                 if (product.varriants[index]) {
//                     // Cập nhật thông tin của biến thể
//                     product.varriants[index] = { ...product.varriants[index], ...variant };
//                 } else {
//                     // Nếu chỉ số không tồn tại, thêm mới biến thể vào mảng
//                    console.log("Không có biến thể")
//                 }
//             });
//         }

//         // Lưu lại sản phẩm đã cập nhật
//         product = await product.save();

//         res.status(200).json({
//             success: true,
//             mes: 'Cập nhật sản phẩm thành công',
//             data: product
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, mes: 'Đã có lỗi xảy ra' });
//     }
// });


//Xóa sản phẩm
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const deletedProduct = await Product.findByIdAndDelete(id); // Sử dụng findByIdAndDelete thay vì findOneAndDelete
        if (deletedProduct) {
            res.status(200).json({
                success: true,
                mes: "Xóa sản phẩm thành công"
            });
        } else {
            // Tìm biến thể theo ID
            const variant = await Product.findOne({ "varriants._id": id }, { "varriants.$": 1 });
            if (variant) {
                // Xóa biến thể
                const deletedVariant = await Product.findOneAndUpdate(
                    { "varriants._id": id },
                    { $pull: { varriants: { _id: id } } },
                    { new: true }
                );
                res.status(200).json({
                    success: true,
                    mes: "Xóa biến thể sản phẩm thành công"
                });
            } else {
                // Không tìm thấy sản phẩm hoặc biến thể để xóa
                res.status(404).json({
                    success: false,
                    mes: "Không tìm thấy sản phẩm hoặc biến thể để xóa"
                });
            }
        }
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).json({
            success: false,
            mes: "Đã xảy ra lỗi khi xóa sản phẩm"
        });
    }
});

  



//Thêm danh sách yêu thích

const addToWishList = asyncHandler(async(req, res)=>{
    const {id} = req.user;
    const {productId} = req.body;
    try{
        const user = await User.findById(id);
        const alreadyAdded = user.wishlist.find((id)=> id.toString()===productId);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(id,
                {
                    $pull: {wishlist: productId},
                },
                {
                    new: true,
                })

            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(id,
                {
                    $push: {wishlist: productId},
                },
                {
                    new: true,
                })
                res.json(user);
        }
    }catch(error){
        throw new Error(error);
    }
});


const rating = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    const {star, productId,comment,createAt} = req.body;
    try {
        const product = await Product.findById(productId);
        let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString());
        if (alreadyRated){
            const updateRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set: {"ratings.$.star":star,"ratings.$.comment":comment,"ratings.$.createAt":createAt},
                },
                {
                    new: true,
                });
                

        }else{
            const rateProduct = await Product.findByIdAndUpdate(productId,
                {
                    $push :{
                        ratings: {
                            star:star,
                            comment:comment,
                            postedby:_id,
                            createAt: createAt
                        }
                    }
                },{
                    new : true,
                })
                
            
    }





const getAllRatings = await Product.findById(productId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      productId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );
    res.json({
        success: true,
        finalProduct
    });

        
    } catch (error) {
        throw new Error(error);
    }
})


const deleteRating = asyncHandler(async(req,res)=>{
    const { productId, ratingId } = req.params;
    try {
        // Tìm sản phẩm với productId
        const product = await Product.findById(productId);
    
        // Kiểm tra xem sản phẩm có tồn tại không
        if (!product) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
    
        // Tìm đánh giá trong mảng ratings của sản phẩm
        const rating = product.ratings.find(r => r._id.toString() === ratingId);
    
        // Kiểm tra xem đánh giá có tồn tại không
        if (!rating) {
          return res.status(404).json({ message: 'Đánh giá không tồn tại' });
        }
    
        // Xóa đánh giá khỏi mảng ratings của sản phẩm
        product.ratings = product.ratings.filter(r => r._id.toString() !== ratingId);
    
        // Lưu sản phẩm sau khi xóa đánh giá
        await product.save();
    
        res.json({ success: true,mes: 'Đánh giá đã được xóa thành công' });
      } catch (error) {
        console.error('Lỗi khi xóa đánh giá:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa đánh giá' });
      }
})



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
            // fs.unlinkSync(path)
           
        }

        const findProduct = await Product.findByIdAndUpdate(
            id,{
                images: urls.map((file)=>{
                    return file;
    
                })
            },{
                new : true
            }
        )
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})



const uploadImagesProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params
    if(!req.files) throw new Error("Missing inputs")
    const response = await Product.findByIdAndUpdate(id,
        {$push:{images:{$each: req.files.map(el=>el.path)}}})
    return res.status(200).json({
        status: response ? true : false
    })
})


const addVariant= asyncHandler(async(req, res)=>{
    const {id} = req.params
    const {title, price, color,quantity,description,category,brand,guarantee,parameter} = req.body
    const thumb= req.files?.thumb[0]?.path
    const model3d= req.files?.model3d[0]?.path
    const images = req.files?.images.map(el=>el.path)
    const totalDiscount = req.body.price
    if(!(title && price && color)) throw new Error("Missing inputs")
    const response = await Product.findByIdAndUpdate(id,
        {$push:
            {varriants: {color, price, thumb,model3d,images,title, quantity,description, category, brand,parameter,totalDiscount,guarantee ,sku: uniqid().toUpperCase()}}},{new: true})
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Thêm biến thể thành công" : "Có lỗi trong quá trình thêm biến thể"

    })
})


const addDiscount = asyncHandler(async(req,res)=>{
    const productId = req.params.id
    const {discount, expiration} = req.body
    if(discount < 0 || discount>100){
        return res.json({ 
            success: false ,
            mes: 'Giá trị giảm giá không hợp lệ'});

    }
    
    let product = await Product.findById(productId);
    let variant;

    if(product){
        product.discount = discount;
        product.expiration = expiration;
   
        if (discount > 0) {
          product.totalDiscount = product.price - (product.price * discount / 100);
        } else {
          product.totalDiscount = product.price;
          product.expiration = new Date('2000-05-02T07:39:07.041+00:00');
        }
   
        await product.save();
   
        return res.json({ 
            success: true ,
            mes: 'Cập nhật thành công'});

    }

    if (!product) {

        const variantID = await Product.findOne({ "varriants._id": productId }, { "varriants.$": 1 });
        let expiration1 =  expiration;

        if (discount > 0) {
            totalDiscount = variantID?.varriants[0].price - (variantID?.varriants[0].price * discount / 100);
        } else {
            totalDiscount = variantID?.varriants[0].price;
            expiration1 = new Date('2000-05-02T07:39:07.041+00:00');
        }
    
        variant = await Product.findOneAndUpdate(
            { "varriants._id": productId }, 
            { $set: { "varriants.$.discount": discount, "varriants.$.expiration": expiration1, "varriants.$.totalDiscount":totalDiscount } },
            { new: true }
        );
        
        if (!variant) {
            return res.status(404).json({ message: 'Sản phẩm hoặc variant không tồn tại' });
        }

        
        await variant.save();
    
        return res.json({ 
            success: true ,
            mes: 'Cập nhật thành công'
        });
    }
});




module.exports={
    createProduct, 
    getAProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
    upLoadImgs,uploadImagesProduct,addVariant,addDiscount,deleteRating
};