const express = require('express')
const mongoose = require('mongoose')
// const router = express.Router();
const Task = mongoose.model("task");

module.exports = function(router,io){
router.get('/tasks/add',(req,res)=>{
    res.render("tasks/addOrUpdate",{title: "Create New Task",btn: "Create"});
});

router.get('/tasks/update/:id',(req,res)=>{
    var id = req.params.id;
    Task.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        }])
        .exec((err,fd)=>{
            if(!err){
                res.render("tasks/addOrUpdate",{title: "Update Task",btn: "Update",task: fd[0]});
            }else{
                console.log("Error Ouccred "+err);
                res.redirect('/tasks');
            }
        });
});

router.post('/tasks/', (req,res)=>{
    if(req.body.id==""){
        insertNewTask(req.body, res);
    }else{
        updateTask(req.body, res);
    }
});

function updateTask(task, res){
    Task.findByIdAndUpdate(task.id,{taskTitle: task.taskTitle, taskDescription: task.taskDescription},(err, doc)=>{
        // console.log(err+doc);
        if(!err){
            io.sockets.emit('change');
            res.redirect("/tasks/");
        }else{
            if(err.name == "ValidationError"){
                handleValidation(err, task);
                res.render("tasks/addOrUpdate",{title: "Update Task",btn: "Update", task: task});
            }else{
                console.log("Error updating record "+err)
            }
        }
    });
}

function insertNewTask(task, res){
    var tasktoadd = new Task();
    tasktoadd.taskTitle = task.taskTitle;
    tasktoadd.taskDescription = task.taskDescription;
    tasktoadd.save((err, doc)=>{
        if(!err){
            io.sockets.emit('change');
            res.redirect("/tasks/");
        }
        else{
            if(err.name == "ValidationError"){
                handleValidation(err, task);
                res.render("tasks/addOrUpdate",{title: "Create New Task",btn: "Create", task: task});
            }else{
                console.log("Error inserting record "+err)
            }
        }
    });
}

function handleValidation(err, data){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'taskTitle':
                data['taskTitleError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/tasks/',(req,res)=>{
    //Get all tasks from the list
    Task.find().lean().exec((err, docs)=>{
        if(!err){
            res.render("tasks/list",{tasks:docs});
        }else{
            console.log("Error in quering Database");
        }
    });
});

router.get('/tasks/delete/:id',(req,res)=>{
    var id = req.params.id;
    Task.findByIdAndDelete(id,()=>{
        io.sockets.emit('change');
        res.redirect("/tasks/");
    });
});
}