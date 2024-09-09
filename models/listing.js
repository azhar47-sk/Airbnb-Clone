const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review =require("./review.js")

const categories = require("./categories.js");
const filterTitles = categories.map(category => category.title);

const listingSchema = new Schema ({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        url:String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:
        {
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    , 
    category : {
        type: String,
        enum:filterTitles,
        default:"trending",
        required: true
    },
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        //   required: true
        },
        coordinates: {
          type: [Number],
        //   required: true
        }
      }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
    
})

const Listing = mongoose.model("listing",listingSchema);
module.exports = Listing;