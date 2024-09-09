const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const Listing = require("../models/listing.js");
const categories = require("../models/categories.js");

const multer  = require('multer');
const{storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// Controller
const listingController = require("../controller/listings.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))   //index Route
    .post(isLoggedIn,upload.single('listing[image]'), validateListing,wrapAsync(listingController.createListing)); // Create Route  
    


// New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))  // Show Route
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing ,wrapAsync(listingController.updateListing))  //Update Route
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));     // Delete Route


router.get("/category/:category",wrapAsync(async(req,res)=>{
    let someListings = req.params.category;
    let Listings = await Listing.find({category: someListings});
    res.render("listings/category.ejs",{Listings,categories});
}));

// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync( listingController.editListing));


module.exports = router;