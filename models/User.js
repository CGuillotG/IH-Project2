let mongoose = require ("mongoose")
let Schema = mongoose.Schema

let userSchema = new Schema ({
    username:{
        type:String,
        required:true
    },
    password:String,
    email:String,
    picURL:{
        type:String,
        default:"", //Agregar URL defaul
    },
    ratingSeller:Number,
    ratingBuyer:Number,
    address:{
        street:String,
        state:String,
        postalcode:Number,
        extNumber:String,
        intNumber:String,
        delegacion:String,
        municipio:String
    },
    payment:{
        numberCard:String,
        month:String,
        year:String,
        cvv:String
    },
    isSeller:{
        type:Boolean,
        default:false
    }
},{timestamps:true,versionKey:false})


module.exports = mongoose.model("USer",userSchema)