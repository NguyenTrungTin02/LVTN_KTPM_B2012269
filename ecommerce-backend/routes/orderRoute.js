const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createOrder, getOrder, getOrders, createOrderCOD, changeStatusOrder } = require("../controller/orderController");
const router = express.Router();

router.post("/create-order",authMiddleware,createOrder);
router.post("/create-order-cod",authMiddleware,createOrderCOD);
router.get("/get-order",authMiddleware,getOrder);

router.get("/get-order/admin",authMiddleware,isAdmin,getOrders);
router.put("/change-order/:id",authMiddleware,changeStatusOrder);


module.exports=router;