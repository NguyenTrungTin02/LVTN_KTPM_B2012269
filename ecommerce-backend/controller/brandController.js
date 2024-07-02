const Brand = require("../models/brandModel");
const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

//Thêm loại thương hiệu
const createBrand = asyncHandler(async(req, res)=>{
    const {name} = req.body
    const thumb = req.files?.thumb[0]?.path
    
    if(!name) throw new Error("Missing inputs")
    if(thumb) req.body.thumb=thumb
    const newBrand = await Brand.create(req.body);
    res.json({
        success: newBrand ? true : false,
        mes: newBrand ? "Thêm thành công" : "Thêm thất bại"
    });
});



// const createBrand = asyncHandler(async(req, res)=>{
//     try{
//         const newBrand = await Brand.create(req.body);
//         res.json(newBrand);
//     }catch(error){
//         throw new Error(error)
//     }
// });

//Cập nhật loại thương hiệu
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const files = req?.files
    const { name: newBrand } = req.body; 
    let thumb; // Khai báo biến thumb trước khi sử dụng

    
    if(files?.thumb){
        thumb = files?.thumb[0].path
    }
    try {
        // Tìm và cập nhật tên loại sản phẩm mới
        const nameOld = await Brand.findById(id)
        const nameOld1 = nameOld?.name
        const updatedBrand = await Brand.findByIdAndUpdate(id,  {name: newBrand, thumb: thumb} , { new: true });
        if (!updatedBrand) {
            return res.json({ success: false, message: 'Không tìm thấy thương hiệu' });
        }

        // Tìm và cập nhật tất cả các sản phẩm có loại sản phẩm cũ
        const updateBrands = await Product.updateMany({ brand: nameOld1 }, { $set: { brand: newBrand} });

        // Trả về kết quả
        res.json({
            success: true,
            mes: 'Cập nhật thành công',
            updatedBrand: updateBrand,
            updateBrands: updateBrands
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật loại sản phẩm', error: error.message });
    }
});


// const updateBrand = asyncHandler(async(req, res)=>{
//     const {id}=req.params;
//     try{
//         const updateBrand = await Brand.findByIdAndUpdate(id,req.body,{new:true,});
//         res.json(updateBrand);
//     }catch(error){
//         throw new Error(error)
//     }
// });

//Xóa loại thương hiệu
const deleteBrand = asyncHandler(async(req, res)=>{
    const {id}=req.params;
    try{
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json({
            success: deleteBrand ? true : false,
            mes: deleteBrand ? "Xóa thành công" : "Có lỗi"
        });
    }catch(error){
        throw new Error(error)
    }
});



//Lấy loại thương hiệu
const getBrand = asyncHandler(async(req, res)=>{
    const {id}=req.params;
    try{
        const getBrand = await Brand.findById(id);
        res.json(getBrand);
    }catch(error){
        throw new Error(error)
    }
});


//Lấy tất cả loại thương hiệu
const getAllBrand = asyncHandler(async(req, res)=>{
    try{
        const getAllBrand = await Brand.find();
        res.json({
            success: getAllBrand ? true : false,
            brand: getAllBrand ? getAllBrand : "Lỗi"
        });
    }catch(error){
        throw new Error(error)
    }
});



module.exports={
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrand
};