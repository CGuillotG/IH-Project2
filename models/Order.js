let moongose = require("mongoose")
let Schema = moongose.Schema

let orderSchema = new Schema({
    expirationDate:Date,
    quantity:Number,
    minQuantity:Number,
    maxQuantity:Number,
    buyerQuantity:Number,
    buyers:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    seller:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true,versionKey:false})


module.exports = moongose.model("Order",orderSchema)