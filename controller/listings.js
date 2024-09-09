const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Category
const categories = require("../models/categories.js");

module.exports.index =async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings, categories});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs",{categories});
}

module.exports.showListing = async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");
    if(!listing){
        req.flash("error","Listing You Requested For Does Not Exist!");
        res.redirect("/listings");
    }else{
    res.render("listings/show.ejs",{listing});
    }
}

module.exports.createListing =async(req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
    .send();
  
    let url = req.file.path;
    let filename = req.file.filename; 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedLisitng = await newListing.save();
    console.log(savedLisitng);
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
}

module.exports.editListing = async (req,res)=>{
   

    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing You Requested For Does Not Exist!");
        res.redirect("/listings");
    }else{
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl,categories});
    }
}

module.exports.updateListing = async(req,res)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
    .send();

    console.log(response.query);

    let {id} = req.params; 
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        listing.geometry = response.body.features[0].geometry;
        await listing.save();
    }
    
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id}= req.params;
    let deletededListing =  await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}