require('./models')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors')
const socket = require('socket.io')
const users = require('./controllers/users');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT,()=>{
    console.log("Server started on port"+PORT);
})

const io = socket(server)

app.use(cors())

app.use(bodyParser.json());

require('./controllers/api')(app,io);

app.use('/api/users',users);

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})
