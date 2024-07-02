const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const crypto= require("crypto")


const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const sendEmail = require("./mailController");

const makeToken = require('uniqid')

//Tạo người dùng mới/ đăng ký
// const createUser = asyncHandler(async (req, res) => {
//     const email = req.body.email;
//     const mobile = req.body.mobile;
//     const findUserEmail = await User.findOne({email:email});
//     const findUserMobile = await User.findOne({mobile:mobile});
//     if(!findUserEmail && !findUserMobile){
//         //tao mot nguoi dung moi
//         const newUser = await User.create(req.body);
//         res.json({
//             success: true,
//             message:"Đăng ký thành công",
//             newUser: newUser
//         });
//     }else{
//         //nguoi dung da ton tai
//         throw new Error("Người dùng đã tồn tại.");
        
//     }
// });


//Tạo người dùng mới/ đăng ký
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const mobile = req.body.mobile;
    const name = req.body.name;
    const password = req.body.password;
    if(!email || !mobile || !name || !password){
            res.status(400).json({
                    success: false,
                    message:"Cần nhập đầy đủ thông tin",
                });
            }
    
    const findUserEmail = await User.findOne({email:email});
    const findUserMobile = await User.findOne({mobile:mobile});
    if(findUserEmail && findUserMobile){
        throw new Error("Người dùng đã tồn tại.");
    }
    const token = makeToken();
    const emailEncrypted = btoa(email)+'@'+token;
    const newUser = await User.create({email:emailEncrypted,password,name,mobile});
    if(newUser){
        const resetUrl = `<h2>Register code</h2><br/><blockquote>${token}</blockquote>`; 
        const data = {
            to: email,
            text: "Hey user",
            subject: "Hoàn tất đăng ký tài khoản",
            html: resetUrl,
        }
        console.log(data)
        sendEmail(data);
    }

    setTimeout(async()=>{
        await User.deleteOne({email:emailEncrypted})
    },[30000])



    res.json({
        success: newUser ? true : false,
        message: newUser ? 'Vui lòng kiểm tra Email':'Có lỗi'
    })
    



    
});


const finalRegister = asyncHandler(async(req,res)=>{
    // const cookie = req.cookies
    const {token} = req.params;
    const notActiveEmail = await User.findOne({email: new RegExp(`${token}$`)})
    if(notActiveEmail){
        notActiveEmail.email=atob(notActiveEmail?.email.split('@')[0])
        notActiveEmail.save()
    }
    res.json({
        success: notActiveEmail ? true : false,
        message: notActiveEmail ? 'Đăng ký thành công':'Đăng ký thất bại'
    })
//     if(!cookie || cookie?.dataRegister?.token!==token) {
//         res.clearCookie('dataRegister')
//         return res.redirect(`http://localhost:3000/finalregister/failed`)
//     }
//     const newUser = await User.create(
//         {
//             email:cookie.dataRegister.email,
//             name:cookie.dataRegister.name,
//             mobile:cookie.dataRegister.mobile,
//             password:cookie.dataRegister.password,});
//     res.clearCookie('dataRegister')
//    if(newUser) return res.redirect(`http://localhost:3000/finalregister/success`)
//    else return res.redirect(`http://localhost:3000/finalregister/failed`)
})



//Đăng nhập
const loginUserController = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    //console.log(email, password)
    //kiem tra có người dùng hay không
    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser.id,{
            refreshToken: refreshToken,            
        },
        {
            new: true,
        }
        );
        res.cookie("refreshToken",refreshToken,{
            httpOnly: true,
            maxAge: 72*60*60*1000,
        })
        res.json({
            success: true,
            message:"Đăng nhập thành công",
            token: generateToken(findUser?._id),
            userData:{
                _id: findUser?._id,
                name: findUser?.name,
                email: findUser?.email,
                mobile: findUser?.mobile,
            }
        });
    }else{
        throw new Error("Thông tin đăng nhập không hợp lệ.");
    }
});

//Admin đăng nhập
const loginAdminController = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    //console.log(email, password)
    //kiem tra có người dùng hay không
    const findAdmin = await User.findOne({email});
    if(+findAdmin.role!==16) throw new Error("không được uỷ quyền");
    if(findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateAdmin = await User.findByIdAndUpdate(findAdmin.id,{
            refreshToken: refreshToken,            
        },
        {
            new: true,
        }
        );
        res.cookie("refreshToken",refreshToken,{
            httpOnly: true,
            maxAge: 72*60*60*1000,
        })
        res.json({
            _id: findAdmin?._id,
            name: findAdmin?.name,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    }else{
        throw new Error("Thông tin đăng nhập không hợp lệ.");
    }
});


//Xóa làm mới token
const handleRefreshToken = asyncHandler(async (req,res)=>{
    const cookie = req.cookies;
    //console.log(cookie);
    if(!cookie?.refreshToken) throw new Error("Không có mã thông báo làm mới trong cookie");
    const refreshToken = cookie.refreshToken;
    //console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error("Không có mã thông báo Làm mới trong db hoặc không khớp")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded)=>{
        if(err || user.id !== decoded.id){
            throw new Error("Đã xảy ra lỗi với mã thông báo làm mới")
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken});
    })
})



//Đăng xuất
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("Không có mã thông báo làm mới trong cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // No Content
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: "" });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // No Content
  });
  

//Lấy tất cả người dùng
const getAllUser = asyncHandler(async(req, res)=>{
    //Lọc
    const queries = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchedEL) => `$${matchedEL}`);

    const formateQueries = JSON.parse(queryString);
    
    if (queries?.name) formateQueries.name = { $regex: queries.name, $options: 'i' };
    
    
    if(req.query.q){
        delete formateQueries.q
        formateQueries['$or'] = [
            {name: {$regex: req.query.q, $options:'i'}},
            {email: {$regex: req.query.q, $options:'i'}},
        ]
    }

    

   
    let queryCommand = User.find(formateQueries);

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
        const counts = await User.countDocuments(formateQueries);
        return res.status(200).json({
            success: response ? true : false,
            users: response ? response : 'Cannot get products',
            counts
        });
    } catch (err) {
        throw new Error(err.message);
    }
})


const getAllUserAdmin = asyncHandler(async (req, res) => {
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
    let queryCommand = User.find(qr)
  
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
      const counts = await User.countDocuments(qr);
      return res.status(200).json({
        success: response ? true : false,
        users: response ? response : 'Cannot get users',
        counts
      });
    } catch (err) {
      throw new Error(err.message);
    }
  });
  


//Lấy một người dùng
const getUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    //console.log(id);
    validateMongoDbId(id);
    try{
        const getUser = await User.findById(id);
        res.json({
            getUser,
        });

    }catch(error){
        throw new Error(error);
    }
})



const getCurrent = asyncHandler(async(req, res)=>{
    const {_id}=req.user;
    const user = await User.findById(_id)
    .select('-refreshToken -password')
    .populate({
        path:'cart',
        populate:{
            path:'product',
            select:'title thumb price images'
        }
    }).populate("wishlist",'title thumb price color totalDiscount discount expiration ')
    return res.status(200).json({
        success: user? true:false,
        rs: user ? user:'User not found'
    })
})


//Cập nhật người dùng
const updateUser = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    
    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
            {
                name: req?.body?.name,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
                isBlock: req?.body?.isBlock,
                role: req?.body?.role,
                address: req?.body?.address,
            },
            { new: true }
        );

        console.log("Updated User:", updateUser); // Log the updated user object

        res.json({
            success: true,
            mes: updateUser ? 'Cập nhật thành công' : 'Cập nhật thất bại'
        });
    } catch (error) {
        console.error("Error updating user:", error); // Log any errors
        throw new Error(error);
    }
});


const updateAUser = asyncHandler(async(req,res) => {
    const {_id} = req.user;
  
    
   
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                name: req?.body?.name,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
                isBlock: req?.body?.isBlock,
                role: req?.body?.role,
                avatar: req?.file?.path,
                address: req?.body?.address
            },
            {
              new: true,  
            }
        );
        res.json({
            success: true,
            mes: updateUser ? 'Cập nhật thành công' :'Cập nhật thất bại'
        });

   
})



//Xóa một người dùng
const deleteUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    //console.log(id);
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            success: true,
            mes: deleteUser ? `Xóa thành công người dùng ${deleteUser.email}` : "Xóa thất bại",
        });

    }catch(error){
        throw new Error(error);
    }
})



//chặn người dùng

const blockUser = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlock: true,
            },
            {
            new: true,
            }
        );
        res.json({
            message:"Người dùng bị chặn"
        })
    }catch(error){
        throw new Error(error);
    }

});

//Bỏ chặn người dùng
const unBlockUser = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlock: false,
            },
            {
            new: true,
            }
        );
        res.json({
            message:"Đã bỏ chặn người dùng"
        })
    }catch(error){
        throw new Error(error);
    }

})


//Thay đổi mật khẩu
const changePassword = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password=password;
        const changePassword = await user.save();
        res.json(changePassword);
    }else{
        res.json(user);
    }
})



const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
      const findUser = await User.findById(_id).populate("wishlist");
      res.json(findUser);
    } catch (error) {
      throw new Error(error);
    }
  });



const addAddress = asyncHandler(async(req, res)=>{
    const {id} = req.user;
    try {
        const addAddress = await User.findByIdAndUpdate(id,
            {
                address: req?.body?.address,
            },{
                new : true,
            })
            res.json(addAddress)
    } catch (error) {
        throw new Error(error);
    }
})


const forgotPasswordToken = asyncHandler (async(req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    console.log(user)
    if(!user) res.status(500).json({
        success: false,
        message:"Không tìm thấy người dùng có email"
    })
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Hi, Please follow this link to reset Your Password.
        This link is valid till 10 minutes from now. 
        <a href='http://localhost:3000/reset-password/${token}'>Click Here</>`; 
        const data = {
            to: email,
            text: "Hey user",
            subject: "Forgot Password Link",
            html: resetUrl,
        }
        sendEmail(data);
        res.json({
            success: true,
            message:'Hãy kiểm tra email của bạn'
        })
    } catch (error) {
        throw new Error(error);
    }
})


const resetPassword = asyncHandler(async(req, res)=>{
    const {password} = req.body;
    const {token}  = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToke: hashedToken,
        passwordResetExpires: {$gt: Date.now()},

    });
    if(!user) throw new Error("Mã thông báo đã hết hạn, vui lòng thử lại sau");
    user.password=password;
    user.passwordResetToke=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    res.json({
        success:true,
        message:"Thay đổi mật khẩu thành công"
    });

})



const updateWishList = asyncHandler(async(req,res)=>{
    const {pid} = req.params;
    const {_id} = req.user;

    const user = await User.findById(_id)
    const alreadyWishList = user.wishlist?.find((el)=>el.toString() === pid)
    if(alreadyWishList){
        const response = await User.findByIdAndUpdate(
            _id,
            {$pull: {wishlist: pid}},
            {new: true}
        )

        return res.json({
            success: response ? true : false,
            mes: response ? "Xóa khỏi danh sách yêu thích":"Lỗi"
        })
    }else{
        const response = await User.findByIdAndUpdate(
            _id,
            {$push: {wishlist: pid}},
            {new: true}
        )

        return res.json({
            success: response ? true : false,
            mes: response ? "Thêm vào danh sách yêu thích":"Lỗi"
        })
    }
})




module.exports={
    createUser, 
    loginUserController, 
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unBlockUser,
    handleRefreshToken,
    logout,
    changePassword,
    loginAdminController,
    getWishlist,
    addAddress,
    forgotPasswordToken,
    resetPassword,
    finalRegister,
    getCurrent,
    updateAUser,
    updateWishList,
    getAllUserAdmin,
};