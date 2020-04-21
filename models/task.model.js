const mongoose = require('mongoose')

var TaskSchema = new mongoose.Schema({
    taskTitle:{
        type: String,
        required: "This field is required."
    },
    taskDescription:{
        type: String,
    },
    userId: {
        type: String,
        required: true
    }
});

mongoose.model("task", TaskSchema);