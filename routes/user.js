const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

// Sign Up
router.route("/signup")
    .get(userController.renderSignUp)
    .post(wrapAsync(userController.signup)
);


// SignIn / login
router.route("/login")
    .get( userController.renderSignIn)
    .post( saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.signIn
);

// Logout user

router.get("/logout",userController.logout);


module.exports = router;