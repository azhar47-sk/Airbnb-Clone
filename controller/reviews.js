const Review = require("../models/review.js");
const Listing = require("../models/listing");

module.exports.postReview = async(req,res,next)=>{
    let{id}= req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!")

    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    const idList = Listing.findByIdAndUpdate(id).populate("reviews");
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")

    res.redirect(`/listings/${id}`)
}