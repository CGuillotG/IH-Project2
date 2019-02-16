require("dotenv").config()

let express = require("express") //Fast, unopinionated, minimalist web framework for node.
let session = require ("express-session") // every user of you API or website will be assigned a unique session, and this allows you to store the user state.
let mongoose = require("mongoose") //DB
let hbs =  require ("hbs") //views
let passport = require ("passport") //Passport's sole purpose is to authenticate requests
let bodyParser = require ("body-parser") //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
let cookieParser = require ("cookie-parser") //Parse Cookie header and populate req.cookies with an object keyed by the cookie names. 
let favicon = require ("serve-favicon") //
let logger = require ("morgan") //
let path = require("path") //

mongoose.connect("mongodb://localhost/carlos",{useNewUrlParser:true})
        .then(x=>{
            console.log(`Connected to Mongo, DB:${x.connections[0].name}`)
        })
        .catch(e=>{
            console.log("Error connecting DB", e)
        })

let app_name = require ("./package.json").name
let debug = require("debug")(
    `${app_name}:${path.basename(__filename).split(".")[0]}`
)

let app = express()

app.use(
    session({
        secret:process.env.SECRET,
        resave:true,
        saveUninitialized:true,
        cookie:{maxAge:60000},
    })
)

app.use(passport.initialize())
app.use(passport.session())

//Middleware Setup
app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false }))
app.use(cookieParser())

app.use(
    require("node-sass-middleware")({
        src:path.join(__dirname,"public"),
        dest:path.join(__dirname,"public"),
        sourceMap:true
    })
)

app.set("views", path.join(__dirname,"views"))
app.set("view engine","hbs")

app.use(express.static(path.join(__dirname,"public")))
app.use(favicon(path.join(__dirname,"public","images","favicon.ico")))

app.locals.loggedUser = false

function isLogged(req,res,next){
    if(req.isAuthenticated()){
        app.locals.loggedUser=true
        next()
    } else {
        app.locals.loggedUser=false
        next()
    }
}

let index = require ("./routes/index")
let auth = require ("./routes/auth")
let products = require ("./routes/products")
let users = require ("./routes/users")
app.use("/",isLogged,index)
app.use("/",isLogged,auth)
app.use("/",isLogged,products)
app.use("/",isLogged,users)

app.listen(3000,function(){
    console.log("working 3000")
})


module.exports = app