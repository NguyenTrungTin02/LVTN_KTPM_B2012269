const asyncHandler = require("express-async-handler")
const nodemailer = require('nodemailer')


const sendEmail = asyncHandler(async(data, req, res)=>{

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MP,
        },
        tls: {
          rejectUnauthorized: false // Tạm thời vô hiệu hóa kiểm tra chứng chỉ SSL
      }
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      
        // send mail with defined transport object
    let info = await transporter.sendMail({
          from: '"Hey 👻" <abc@gmail.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.html, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      

})


module.exports=sendEmail;