const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

// Controller
const reviewController = require("../controller/reviews.js");

// Reviews
// Post Route

router.post("/",isLoggedIn,validateReview,wrapAsync( reviewController.postReview ));

// Delete Route

router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))


module.exports = router;