let mongoose = require ("mongoose")
let Schema = mongoose.Schema

let reviewSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    rating:Number,
    body:String,
    picURL:String
},{timestamps:true,versionKey:false})




module.exports = mongoose.model("Review", reviewSchema)