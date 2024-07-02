const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim: true,
    },
    slug:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:
    {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required:true,
    },
    sold: {
        type: Number,
        default:0,
    },
    model3d:{
        type: String,
        default:''
    },
    images : {
        type: Array
    },

    thumb:{
        type: String,
        require: true
    },

    varriants: [
        {
            color: String,
            price: Number,
            thumb: String,
            images: Array,
            title: String,
            sku: String,
            sold: {
                type: Number,
                default: 0
            },
            quantity: Number,
            model3d: String,
            description: String,
            category: String,
            brand: String,
            parameter:{
                type: String
            },
            guarantee: {
                type: String
            },
            discount: {
                type: Number,
                default:0
            },
            expiration: {
                type:Date,
                default: '2000-05-02T07:39:07.041+00:00'
            },
            totalDiscount: {
                type: Number,
                
            },

        }
    ],
    color: {
        type: String,
        required: true,
    },
    ratings: [{
        star: Number,
        comment: String,
        postedby: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
        createAt: {
            type: Date,
          
        }
    }],
    totalRating:{
        type: String,
        default:0,
    },
    parameter:{
        type: String
    },
    guarantee: {
        type: String
    },
    discount: {
        type: Number,
        default:0
    },
    expiration: {
        type:Date,
        default: '2000-05-02T07:39:07.041+00:00'
    },
    totalDiscount: {
        type: Number,
        
    },


},{
    timestamps: true,
});

//Export the model
module.exports = mongoose.model("Product", productSchema);