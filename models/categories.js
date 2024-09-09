const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const categorySchema = new Schema ({
//   title:{
//     type:String,
//     required:true,
//   },
//   icon:{
//     type:String,
//     required:true,
//   }
// })


const categories =[
  {title: 'Home', icon: 'fa-solid fa-ticket'},
  { title: 'Trending', icon: 'fa-solid fa-fire-flame-curved' },
  { title: 'Rooms', icon: 'fa-solid fa-bed' },
  { title: 'Beach', icon: 'fa-solid fa-umbrella-beach' },
  { title: 'Farms', icon: 'fa-solid fa-cow' },
  { title: 'Mountain', icon: 'fa-solid fa-mountain-city' },
  { title: 'Castles', icon: 'fa-brands fa-fort-awesome' },
  { title: 'Camps', icon: 'fa-solid fa-tents' },
  { title: 'Amazing Pools', icon: 'fa-solid fa-person-swimming' },
  { title: 'Cable Car', icon: 'fa-solid fa-cable-car' },
  { title: 'Mansions', icon: 'fa-solid fa-hotel' },
  { title: 'Domes', icon: 'fa-solid fa-igloo' },
  { title: 'Boat', icon: 'fa-solid fa-sailboat' }
];
module.exports = categories;