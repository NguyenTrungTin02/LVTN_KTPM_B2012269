const express = require("express");
const { 
    createBrand, 
    updateBrand, 
    deleteBrand,
    getBrand,
    getAllBrand
} = require("../controller/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const uploader= require('../config/cloudinary.config')
const router = express.Router();

router.post("/create-brand",authMiddleware,isAdmin,uploader.fields([
    {name:'thumb',maxCount:1}
]),createBrand);
router.put("/update-brand/:id",authMiddleware,isAdmin,uploader.fields([
    {name:'thumb',maxCount:1}
]),updateBrand);
router.delete("/delete-brand/:id",authMiddleware,isAdmin,deleteBrand);
router.get("/get-brand/:id",getBrand);
router.get("/get-all-brand",getAllBrand);



module.exports=router;