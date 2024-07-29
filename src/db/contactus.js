const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema({
    name:String,
    email:String,
    phonenumber:Number,
    state:String,
    district:String,
    text:String,
    createdAt: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model("contactus",contactusSchema);