const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require('./Routes/user')
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session);
const multer = require('multer');

const key = new mongodbSession({
    uri:"mongodb+srv://root:nabeel@cluster1.6dvyvex.mongodb.net/Guru",
    collection:'Sessions'
}) 


const app = express();
const fileStorage = multer.diskStorage({
    destination: (req , file , cb)=>{
        cb(null , 'image');
    },
    filename:(req , file , cb)=>{
        cb(null, new Date().toISOString + "-" + file.originalname);
    }
})




app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use("/Image",express.static(path.join(__dirname, 'image')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage}).single('image'));
app.use(session({
    secret:"This is my personal KEY",
    resave:false,
    saveUninitialized:false,
    store:key
}));

app.use(userRoute);

mongoose.connect('mongodb+srv://root:nabeel@cluster1.6dvyvex.mongodb.net/Guru').then(result => {
    console.log("database connected");
    app.listen(3000);
})
    .catch(err => console.log(err));