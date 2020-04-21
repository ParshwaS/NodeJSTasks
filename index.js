const conn = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
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
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', path.join(__dirname,"/views/"));

app.engine("hbs",handlebars({
    extname: "hbs",
    defaultLayout: "mainLayout",
    layoutsDir: __dirname+"/views/layouts"
}));

app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get("/", (req,res)=>{
    res.render("index", {});
});

app.use('/api/users',users);

require('./controllers/api')(app,io);

require('./controllers/tasks')(app,io);