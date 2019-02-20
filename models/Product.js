let moongose = require("mongoose")
let Schema = moongose.Schema

let productSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    details:String,
    category:String,
    unitPrice:Number,
    picURL:{
        type:String,
        default:"https://res.cloudinary.com/cgui1107/image/upload/v1550696064/Community-IHProject2/DefaultProductPic.png"
    },
    seller:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    order:{
        type:Schema.Types.ObjectId,
        ref:"Order"
    },
    reviews:{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
},{timestamps:true,versionKey:false})


module.exports = moongose.model("Product",productSchema)