const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://admin:administrator@trycluster-jqqps.mongodb.net/Tasks",{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false }, (err)=>{
    if(!err){
        console.log("Database connected...");
    }else{
        console.log("Error in connecting to Database");
    }
});

const Task = require('./task.model');
const User = require('./user.model');