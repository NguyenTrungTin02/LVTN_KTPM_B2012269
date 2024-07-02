const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRoute = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const postRouter = require("./routes/postRoute");
const productCategoryRouter = require("./routes/productCategoryRoute");
const postCategoryRouter = require("./routes/postCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
const cors = require('cors')


const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

dbConnect();

app.use(cors({
    origin: process.env.CLIENT_PORT,
    methods: ['POST','PUT','GET','DELETE'],
    credentials:true,
}))


app.use(morgan("dev"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());
app.use('/api/user',authRoute)
app.use("/api/product",productRouter);
app.use("/api/post",postRouter);
app.use("/api/product-category",productCategoryRouter);
app.use("/api/post-category",postCategoryRouter);
app.use("/api/brand",brandRouter);
app.use("/api/coupon",couponRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);




app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () =>{
    console.log(`Server is running at PORT ${PORT}`);
});