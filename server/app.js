var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoose = require("mongoose")
const mongoDB = "mongodb://localhost:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db = mongoose.connection
db.on("error",console.error.bind(console,"MongoDB connection error."))


var app = express();



/**这个cors顺序很重要 */
if(process.env.NODE_ENV ==="development"){
    var corsOptions = {
        origin: "http://localhost:3000",
        methods: ["POST"],
        credentials: true,
        optionsSuccessStatus:200,
    };
    app.use(cors(corsOptions))
}else if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.resolve("..","client","build")))
    app.get("*",(req,res)=>
        res.sendFile(path.resolve("..","client","build","index.html"))
    )
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);




module.exports = app;
