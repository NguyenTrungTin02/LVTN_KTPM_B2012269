const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const asyncHandler = require('express-async-handler');


const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;

    try {
        let products = [];
        const user = await User.findById(_id);

        // Tìm giỏ hàng của người dùng và xóa nó nếu tồn tại
        await Cart.deleteOne({ orderBy: user._id });

        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }

        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count;
        }

        // Tạo giỏ hàng mới
        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user?._id,
        }).save();

        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});


const getCart = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    try {
        const getCart = await Cart.findOne({orderBy:_id}).populate("products.product");
        res.json(getCart)
    } catch (error) {
        throw new Error(error)
    }
});


const emptyCart = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    try {
        const user = await User.findOne({_id});
        const emptyCart = await Cart.findOneAndDelete({orderBy: user._id});
        res.json(emptyCart);
    } catch (error) {
        throw new Error(error)
    }
});


const applyCoupon = asyncHandler(async(req, res)=>{
    const {coupon} = req.body;
    const {_id} = req.user;
    const validCoupon = await Coupon.findOne({name: coupon});
    if(validCoupon===null){throw new Error("Phiếu giảm giá không hợp lệ")}
    const user = await User.findOne({_id});
    let {cartTotal} = await Cart.findOne({orderBy: user._id})
        .populate("products.product");

    let totalAfterDiscount = (cartTotal - (cartTotal*validCoupon.discount)/100).toFixed(2);
    await Cart.findOneAndUpdate(
        {orderBy: user._id},
        {totalAfterDiscount},
        {new: true},
    )
    res.json(totalAfterDiscount)
})


const updateCart = asyncHandler(async(req, res)=>{
    const {_id}  = req.user
    const {pid, quantity=1,color,price,thumbnail,title} = req.body
    if(!pid || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el=>el.product.toString() === pid && el.color===color)
    if(alreadyProduct){
            const response = await User.updateOne({cart: 
                {$elemMatch: alreadyProduct}},
                {$set: 
                    {"cart.$.quantity":quantity, 
                    "cart.$.price":price, 
                    "cart.$.thumbnail":thumbnail,
                    "cart.$.title":title
                }},{new: true})
            return res.status(200).json({
                success: response ? true : false,
                mes: response ? "Đã thêm sản phẩm vào giỏ hàng" :'Some thing went wrong'
            })
        
    } else{
        const response = await User.findByIdAndUpdate(_id,
            {$push:{cart:{product:pid, quantity,color,price,thumbnail,title}}},{new: true})
            return res.status(200).json({
                success: response ? true : false,
                mes: response ? "Đã thêm sản phẩm vào giỏ hàng" :'Some thing went wrong'
            })
    }
})


const removeProductCart = asyncHandler(async(req, res)=>{
    const {_id}  = req.user
    const {pid,color} = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el=>el.product.toString()===pid && el.color===color)
    if(!alreadyProduct){
        return res.status(200).json({
            success: true,
            mes: "Updated cart"
        })
            
    }

    const response = await User.findByIdAndUpdate(_id,{$pull:{cart:{product:pid,color}}},{new: true})
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Updated cart" :'Some thing went wrong'
    })
})



module.exports={userCart,getCart,emptyCart,applyCoupon,updateCart,removeProductCart}
