const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const uniqid = require('uniqid'); 
const asyncHandler = require('express-async-handler');



const createOrder = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    const { products, total, address, status } = req.body;

    // Lặp qua từng sản phẩm trong đơn hàng
    for (const productInfo of products) {
        console.log(products)
        const { product, quantity, color } = productInfo;
        const pid = product._id;

        const productInDB = await Product.findById(pid);

        if (productInDB) {
            if (productInDB.color === color) {
                // Nếu màu của sản phẩm trong đơn hàng giống với màu của sản phẩm trong DB
                await Product.updateOne(
                    { _id: pid },
                    { $inc: { quantity: -quantity, sold: +quantity } }
                );
            } else {
                // Tìm sản phẩm có màu trùng với biến thể
                const variantProduct = await Product.findOne({ _id: pid, "varriants.color": color });

                if (variantProduct) {
                    // Cập nhật số lượng của biến thể có màu tương ứng
                    await Product.updateOne(
                        { _id: pid, "varriants.color": color },
                        { $inc: { "varriants.$.quantity": -quantity, "varriants.$.sold": +quantity } }
                    );
                }
            }
        }
    }

    if (address) {
        // Cập nhật địa chỉ và xóa giỏ hàng của người dùng
        await User.findByIdAndUpdate(_id, { address: address, cart: [] });
    }

    const data = { products, total, orderBy: _id, address };
    if (status) data.status = status;

    // Tạo đơn hàng mới
    const rs = await Order.create(data);

    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong'
    });
});


const createOrderCOD = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    const { products, total, address, status } = req.body;

    
   
        // Cập nhật địa chỉ và xóa giỏ hàng của người dùng
        await User.findByIdAndUpdate(_id, { address, cart: [] });

  

    const data = { products, total, orderBy: _id, address };
    if (status) data.status = status;

    // Tạo đơn hàng mới
    const rs = await Order.create(data);

    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong'
    });
});


const changeStatusOrder = asyncHandler(async(req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const { products } = req.body;

    try {
        // Find the order by ID
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }

        if (status === 'close') {
            order.status = 'Canceld';
            await order.save();
            return res.status(200).send({ success: true, mes: 'Đã hủy đơn hàng thành công' });
        }

        // Update the status of the order
        order.status = status || order.status;

        // If the status is 'dxn', update it in the database
        if (status === 'dxn') {
            order.status = 'dxn';
            await order.save();
            return res.status(200).send({ success: true, mes: 'Đã xác nhận đơn hàng' });
        }

        if (status === 'Succeed') {
            order.status = 'Succeed';
            console.log(products)
            for (const productInfo of products) {
                const { product, quantity, color } = productInfo;
                const pid = product;
        
                const productInDB = await Product.findById(pid);
        
                if (productInDB) {
                    if (productInDB.color === color) {
                        // Nếu màu của sản phẩm trong đơn hàng giống với màu của sản phẩm trong DB
                        await Product.updateOne(
                            { _id: pid },
                            { $inc: { quantity: -quantity, sold: +quantity } }
                        );
                    } else {
                        // Tìm sản phẩm có màu trùng với biến thể
                        const variantProduct = await Product.findOne({ _id: pid, "varriants.color": color });
        
                        if (variantProduct) {
                            // Cập nhật số lượng của biến thể có màu tương ứng
                            await Product.updateOne(
                                { _id: pid, "varriants.color": color },
                                { $inc: { "varriants.$.quantity": -quantity, "varriants.$.sold": +quantity } }
                            );
                        }
                    }
                }
            }
            await order.save();
            return res.status(200).send({ success: true, mes: 'Thanh toán đơn hàng thành công' });
        }

        // Save the updated order
        const updatedOrder = await order.save();

        res.status(200).send({ message: 'Cập nhật thành công', order: updatedOrder });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});




// const createOrder = asyncHandler(async(req, res)=>{
//     const {COD, coupon} = req.body;
//     const {_id} = req.user;
//     try {
//         if(!COD) {throw new Error("Create cash order failed")};
//         const user = await User.findById(_id);
//         let userCart = await Cart.findOne({orderBy: user._id});
//         let finalAMout = 0;
//         if(coupon && userCart.totalAfterDiscount){
//             finalAMout = userCart.totalAfterDiscount;
//         }else{
//             finalAMout = userCart.cartTotal;
//         }

//         let newOrder = await Order({
//             products: userCart.products,
//             paymentIntent: {
//                 id: uniqid(),
//                 method: "COD",
//                 amount : finalAMout,
//                 status: "Cash on delivery",
//                 created: Date.now(),
//                 currency: "vnd",
//             },
//             orderBy: user._id,
//             orderStatus: "Cash on Delivery",
//         }).save();
//         let update = userCart.products.map((item)=>{
//             return {
//                 updateOne :{
//                     filter: {_id:item.product._id},
//                     update: {$inc:{quantity: -item.count, sold: +item.count}},
//                 },
//             };
//         });
//         const updated = await Product.bulkWrite(update,{});
//         res.json({message: "success"})
//     } catch (error) {
//         throw new Error(error);
//     }

// })


const getOrders = asyncHandler(async (req, res) => {
    // Lọc
    const queries = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields", "month", "year"];
    excludeFields.forEach((el) => delete queries[el]);
  
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchedEL) => `$${matchedEL}`);
  
    const formateQueries = JSON.parse(queryString);
  
    // Lấy tháng và năm từ query nếu có
    const { month, year } = req.query;
  
    // Nếu có tháng và năm, thêm điều kiện lọc theo tháng và năm
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
  
      formateQueries.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }
  
    const qr = { ...formateQueries };
    let queryCommand = Order.find(qr).populate('orderBy');
  
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
      const counts = await Order.countDocuments(qr);
      return res.status(200).json({
        success: response ? true : false,
        orders: response ? response : 'Cannot get products',
        counts
      });
    } catch (err) {
      throw new Error(err.message);
    }
  });
  


const getOrder = asyncHandler(async(req,res)=>{
    const {_id} = req.user

    //Lọc
    const queries = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchedEL) => `$${matchedEL}`);

    const formateQueries = JSON.parse(queryString);
   //  let colorQueryObject = {};
   //  if (queries?.title) formateQueries.title = { $regex: queries.title, $options: 'i' };
   //  if (queries?.category) formateQueries.category = { $regex: queries.category, $options: 'i' };

   //  if (queries?.color) {
   //      delete formateQueries.color;
   //      const colorArr = queries.color?.split(',');
   //      const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }));
   //      colorQueryObject = { $or: colorQuery };
   //  }

   //  let queryObject={}

   //  if(queries?.q){
   //      delete formateQueries.q
   //      queryObject={ $or:[
   //          {color: {$regex: queries.q, $options:'i'}},
   //          {title: {$regex: queries.q, $options:'i'}},
   //          {category: {$regex: queries.q, $options:'i'}},
   //          {brand: {$regex: queries.q, $options:'i'},}
   //      ]}
   //  }

    const qr = {...formateQueries, orderBy:_id };
    let queryCommand = Order.find(qr);

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
        const counts = await Order.countDocuments(qr);
        return res.status(200).json({
            success: response ? true : false,
            orders: response ? response : 'Cannot get products',
            counts
        });
    } catch (err) {
        throw new Error(err.message);
    }

})



// const getOrder = asyncHandler(async(req, res)=>{
//     const {_id} = req.user;
//     try{
//         const getOrderUser = await Order.findOne({orderBy: _id})
//             .populate("products.product")
//             .populate("orderBy")
//             .exec();;
//         res.json({
//             success: getOrderUser ? true : false,
//             getOrderUser: getOrderUser? getOrderUser:"lỗi"
//         });

//     }catch(error){
//         throw new Error(error);
//     }
// })



module.exports={createOrder,getOrder,getOrders,createOrderCOD,changeStatusOrder};