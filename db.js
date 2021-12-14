const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://SinchanMaitra:SMMongoD345@cluster0.xk00b.mongodb.net/onotebook?retryWrites=true&w=majority"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;