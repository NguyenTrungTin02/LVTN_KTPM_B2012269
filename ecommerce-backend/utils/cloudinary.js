const cloudinary = require('cloudinary')
          
cloudinary.config({ 
  cloud_name: 'dqwdifi3m', 
  api_key: '185614462943358', 
  api_secret: 'RYIN21bqfksdtzGgARqTFhv4Vmc' 
});


const cloudinaryUpImg = async(fileUp) =>{
    return new Promise((resolve) =>{
        cloudinary.uploader.upload(fileUp, (result) =>{
            resolve(
                {
                    url: result.secure_url,
                },
                {
                    resource_type: "auto"
                }
            )
        })
    })
}


module.exports=cloudinaryUpImg;