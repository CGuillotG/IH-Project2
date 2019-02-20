let moongose = require("mongoose")
let Schema = moongose.Schema

let orderSchema = new Schema({
    isActive:{
        type:Boolean,
        default:true,
    },
    startDate:Date,
    expirationDate:Date,
    minQuantity:Number,
    maxQuantity:Number,
    buyers:[{
        buyer:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        buyerQuantity:Number,
    }]

},{timestamps:true,versionKey:false})


module.exports = moongose.model("Order",orderSchema)