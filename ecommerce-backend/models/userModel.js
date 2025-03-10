const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    avatar:{
        type: String
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum: ['16','8'],
        default:8,
    },
    isBlock:{
        type: Boolean,
        default: false,
    },
    cart: [
        {
            product: {type: mongoose.Types.ObjectId, ref: 'Product'},
            quantity: Number,
            color: String,
            price: Number,
            thumbnail: String,
            title: String
        }
    ]
    ,
    address: {
        type:String,
    },
    wishlist: [{
        type: mongoose.Types.ObjectId, 
        ref:"Product"
    }],
    refreshToken:{
        type: String,
    },
    passwordChange: Date,
    passwordResetToke: String,
    passwordResetExpires: Date,
    registerToken:{
        type: String,
    }
},{
    timestamps: true,
});

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToke = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30*60*1000;
    return resetToken;
}


//Export the model
module.exports = mongoose.model('User', userSchema);