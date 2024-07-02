const express = require("express");
const { userCart, getCart, emptyCart, applyCoupon, updateCart, removeProductCart } = require("../controller/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");


const router = express.Router();
router.post("/cart-v1",authMiddleware,userCart);
router.get("/get-cart",authMiddleware,getCart);
router.delete("/empty-cart",authMiddleware,emptyCart);
router.post("/apply-coupon",authMiddleware,applyCoupon);
router.put("/cart",authMiddleware,updateCart);
router.delete("/remove-cart/:pid/:color",authMiddleware,removeProductCart);


module.exports=router;