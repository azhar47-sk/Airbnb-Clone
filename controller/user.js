const User = require("../models/user.js");


module.exports.renderSignUp = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            } else {
                req.flash("success", "Welcome To Wanderlust!");
                res.redirect("/listings");
            }
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

// SignIn
module.exports.renderSignIn = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.signIn = async (req, res) => {
    req.flash("success","Welcome to Wanderlust! You are Logged in");
    console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

// logout

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        } 
            req.flash("success","You Are Logged Out!");
            res.redirect("/listings")
        })
}