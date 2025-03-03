const multer = require('multer')
const sharp = require('sharp');
const path = require("path");
const fs = require('fs')

const multerStorage =  multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,"../public/images"))
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix+".jpeg");
    }
})


const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true);

    }else{
        cb({
            message: "Unsupported file format",
        },
            false
        )
    }
}

const upLoadImg = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fieldSize: 1000000}
}) 


const productImgResize = async(req, res, next) =>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async(file)=>{
        await sharp(file.path)
            .resize(300,300)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`public/images/product/${file.filename}`);
        fs.unlinkSync(`public/images/product/${file.filename}`)
    }));
    next();
}



const postImgResize = async(req, res, next) =>{
    if(!req.files) return next();
    await Promise.all(req.files.map(async(file)=>{
        await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality:90})
        .toFile(`public/images/post/${file.filename}`);
        fs.unlinkSync(`public/images/post/${file.filename}`)
    }));
    next();
}


module.exports={upLoadImg ,productImgResize, postImgResize}