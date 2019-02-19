let mongoose = require ("mongoose")
let Schema = mongoose.Schema
const PLM = require('passport-local-mongoose')

let userSchema = new Schema ({
    name:String,
    surname:String,
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    picURL:{
        type:String,
        default:"https://res.cloudinary.com/cgui1107/image/upload/v1550515432/Community-IHProject2/DefaultProfilePic.jpg",
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

userSchema.plugin(PLM, { usernameField: 'email' })
module.exports = mongoose.model("User",userSchema)