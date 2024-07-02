const express = require("express");
const { 
    createCoupon, updateCoupon, deleteCoupon, getCoupon, getAllCoupon,
     
} = require("../controller/couponController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();



router.post("/create-coupon",authMiddleware,isAdmin,createCoupon);
router.put("/update-coupon/:id",authMiddleware,isAdmin,updateCoupon);
router.delete("/delete-coupon/:id",authMiddleware,deleteCoupon);
router.get("/get-coupon/:id",authMiddleware,isAdmin,getCoupon);
router.get("/get-all-coupon",authMiddleware,isAdmin,getAllCoupon);



module.exports=router;