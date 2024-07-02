const expressAsyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity : Number,
        color: String,
        price: Number,
        thumbnail: String,
        title: String
    },
    ],
    status: {
        type: String,
        default: "Canceld",
        enum:[
            "Canceld",
            "Succeed",
            "cxn",
            "dxn",
            

        ],
    },
    orderBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    total:Number,
    address: {
        type: String
    }
},{timestamps:true,}
);





//Export the model
module.exports = mongoose.model('Order', orderSchema);