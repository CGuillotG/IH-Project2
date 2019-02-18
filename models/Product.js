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
    picURL:String,
    seller:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    orders:{
        type:Schema.Types.ObjectId,
        ref:"Order"
    },
    reviews:{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
},{timestamps:true,versionKey:false})


module.exports = moongose.model("Product",productSchema)