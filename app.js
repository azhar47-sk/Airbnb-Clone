require('dotenv').config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

// Routers
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const wrapAsync = require('./utils/wrapAsync.js');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"public")));

// mongoose
main().then(()=>{
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

store.on("error",()=>{
    console.log("Error in Mongo Store ", err);
});

// Express Session
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //week * hours * min * secs * mili-Secs
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.post("/searchListing",wrapAsync(async(req,res)=>{
//     const limit = parseInt(req.query.limit) || 9;
//     const startIndex = parseInt(req.query.startIndex) || 0 ;

//     let price = req.query.price;
//     let name = req.query.name;

//     if(offer == undefined || offer == 'false'){

//     }
// }));
 
// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "apnacollege@gmail.com",
//         username: "delta-student"
//     });
//     let registerdUser = await User.register(fakeUser,"helloWorld");
//     res.send(registerdUser);
// });

// Listings Router
app.use("/listings",listingRouter);

// Reviews Router
app.use("/listings/:id/reviews",reviewRouter);

// User Router
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {status = 400,message="Something Went Wrong!"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", {message});
});

app.listen(8080,()=>{
    console.log('app listening on port 8080');
});