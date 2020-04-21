const mongoose = require('mongoose')
const Task = mongoose.model("task");
const User = mongoose.model('user');
const jwt = require('jsonwebtoken')

module.exports = function(app,io){

    app.get('/api/lists',(req,res)=>{
        var decoded = jwt.verify(req.headers['authorization'], '@#RTY%$')
        Task.find({
            userId: decoded._id
        }).lean().exec((err, docs)=>{
            if(!err){
                res.json({docs});
            }else{
                console.log("Error in quering Database");
            }
        });
    })

    app.post('/api/get',(req,res)=>{
        var decoded = jwt.verify(req.headers['authorization'], '@#RTY%$')
        User.findOne({
            _id: decoded._id
        })
        .then(user => {
            if(user){
                Task.findOne({
                    _id: req.body.id,
                    userId: decoded._id
                }).lean().exec((err,doc)=>{
                    if(!err){
                        if(doc==null){
                            res.status(403).send({message:"Null"});
                        }else{
                            res.status(200).send(doc);                    
                        }
                    }else{
                        res.status(403).send({message:"Error"});
                        console.log("Error in quering Database");
                    }
                })
            }else{
                res.json({error: "User Authentication Failed"})
            }
        })
    })

    app.post('/api/add',(req,res)=>{
        var decoded = jwt.verify(req.headers['authorization'], '@#RTY%$')
        User.findOne({
            _id: decoded._id
        })
        .then(user=>{
            if(user){
                var task = new Task();
                task.taskTitle = req.body.taskTitle;
                task.taskDescription = req.body.taskDescription;
                task.userId = user._id;
                task.save((err,doc)=>{
                    if(!err){
                        io.sockets.emit('change');
                        res.status(200).send(doc);
                    }else{
                        console.log("Error in inserting record");
                        res.status(403).send({message:"Error in inserting record"});
                    }
                });
            }else{
                res.status(403).send({message:"Token Authentication Failed"})
            }
        })
    })

    app.post('/api/delete',(req,res)=>{
        var decoded = jwt.verify(req.headers['authorization'], '@#RTY%$')
        User.findOne({
            _id: decoded._id
        })
        .then(user=>{
            if(user){
                Task.findByIdAndDelete(req.body.id,(err)=>{
                    if(!err){
                        io.sockets.emit('change');
                        res.status(200).send({message:"Deleted Successfully"})
                    }else{
                        res.status(403).send({message:"Delete was unsccessfull"})
                    }
                });
            }else{
                res.status(403).send({message:"Token Authentication Failed"})
            }
        })
        .catch(err => {
            res.send('error '+err)
        })
    });

    app.post('/api/update',(req,res)=>{
        var task = req.body;
        var decoded = jwt.verify(req.headers['authorization'], '@#RTY%$')
        User.findOne({
            _id: decoded._id
        })
        .then(user=>{
            if(user){
                Task.findByIdAndUpdate(task.id,{taskTitle: task.taskTitle, taskDescription: task.taskDescription},(err, doc)=>{
                    if(!err){
                        io.sockets.emit('change');
                        res.status(200).send({message:"Task Updated"});
                    }else{
                        res.status(403).send({message:"Task change cannot happen"});
                        console.log("Error updating record "+err);
                    }
                });
            }else{
                res.json({error: "User Authentication Failed"})
            }
        })
        .catch(err=>{
            res.send('error: '+err)
        })
    });

}