const ProductCategory = require("../models/productCategoryModel");
const Product = require('../models/productModel');
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

//Thêm loại sản phẩm
const createProductCategory = asyncHandler(async(req, res)=>{
    const {name} = req.body
    const thumb = req.files?.thumb[0]?.path
    
    if(!name) throw new Error("Missing inputs")
    if(thumb) req.body.thumb=thumb
    const newProductCategory = await ProductCategory.create(req.body);
    res.json({
        success: newProductCategory ? true : false,
        mes: newProductCategory ? "Thêm thành công" : "Thêm thất bại"
    });
    
});

//Cập nhật loại sản phẩm
const updateProductCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const files = req?.files
    const { name: newCategoryName } = req.body; 
    let thumb; // Khai báo biến thumb trước khi sử dụng

    
    if(files?.thumb){
        thumb = files?.thumb[0].path
    }
    try {
        // Tìm và cập nhật tên loại sản phẩm mới
        const nameOld = await ProductCategory.findById(id)
        const nameOld1 = nameOld?.name
        const updatedCategory = await ProductCategory.findByIdAndUpdate(id,  {name: newCategoryName, thumb: thumb} , { new: true });
        if (!updatedCategory) {
            return res.json({ success: false, message: 'Không tìm thấy loại sản phẩm' });
        }

        // Tìm và cập nhật tất cả các sản phẩm có loại sản phẩm cũ
        const updateProducts = await Product.updateMany({ category: nameOld1 }, { $set: { category: newCategoryName } });

        // Trả về kết quả
        res.json({
            success: true,
            mes: 'Cập nhật thành công',
            updatedCategory: updatedCategory,
            updatedProducts: updateProducts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật loại sản phẩm', error: error.message });
    }
});






//Xóa loại sản phẩm
const deleteProductCategory = asyncHandler(async(req, res)=>{
    const {id}=req.params;
    try{
        const deleteProductCategory = await ProductCategory.findByIdAndDelete(id);
        res.json({
            success: deleteProductCategory ? true : false,
            mes: deleteProductCategory? "Xóa thành công" : "Lỗi"
        });
    }catch(error){
        throw new Error(error)
    }
});



//Lấy loại sản phẩm
const getProductCategory = asyncHandler(async(req, res)=>{
    const {id}=req.params;
    try{
        const getProductCategory = await ProductCategory.findById(id);
        res.json(getProductCategory);
    }catch(error){
        throw new Error(error)
    }
});


//Lấy tất cả loại sản phẩm
const getAllProductCategory = asyncHandler(async(req, res)=>{
    try{
        const getAllProductCategory = await ProductCategory.find();
        res.json({
            success: true,
            categories: getAllProductCategory
        });
    }catch(error){
        throw new Error(error)
    }
});



module.exports={
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    getProductCategory,
    getAllProductCategory
};