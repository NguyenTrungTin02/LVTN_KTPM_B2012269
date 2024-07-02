const express = require('express');
const { 
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
    } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const uploader= require('../config/cloudinary.config')

const router = express.Router();

router.post("/register",createUser);
router.put("/finalregister/:token",finalRegister);


router.post("/forgot-password",forgotPasswordToken);
router.put("/reset-password",resetPassword);


router.put("/changePassword",authMiddleware,changePassword);
router.post("/login",loginUserController);
router.get("/current",authMiddleware,getCurrent);

router.post("/login-admin",loginAdminController);


router.get("/getAllUser",getAllUser);
router.get("/getAllUserAdmin",authMiddleware,getAllUserAdmin);
router.get("/get-wishlist",authMiddleware,getWishlist);
router.put("/add-address",authMiddleware,addAddress);


router.get("/refresh",handleRefreshToken);
router.get("/logout",logout);

router.get("/:id",authMiddleware,isAdmin,getUser);

router.delete("/:id",deleteUser);
router.put("/editAUser",authMiddleware,uploader.single('avatar'),updateAUser);

router.put("/editUser/:id",authMiddleware,updateUser);

router.put("/wish-list/:pid",authMiddleware,updateWishList);



router.put("/block-user/:pid",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unBlockUser);



module.exports=router;