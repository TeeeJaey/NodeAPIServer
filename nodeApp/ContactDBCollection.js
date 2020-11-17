
const mongoose = require('mongoose');   // Connect to Mongo Database

//#region "Mongo DB"

mongoose.connect('mongodb://localhost/nodeApp', { useNewUrlParser: true , useUnifiedTopology: true } )
    .then(() => console.log("Connected to MongoDB."))
    .catch(err => console.log("Error Connecting to MongoDB" , err));

const contactDBSchema = new mongoose.Schema({
    id: String,
    name: String,
    phone: Number,
    isFavourite : Boolean,
    date: { type: Date, default: Date.now }
});

const ContactDB = mongoose.model('contact' , contactDBSchema);

module.exports.ContactDB = ContactDB;


