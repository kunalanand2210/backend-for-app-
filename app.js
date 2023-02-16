const express = require('express');
const app = express();



var cors = require('cors');
app.use(cors());
app.use(express.json());

// use passport initiallization here
const passport = require('passport');
app.use(passport.initialize());

const path = require('path');
require('dotenv').config({  
    path: path.join(__dirname,'.env')
})

const userRoute = require('./routes/users');

const adminRoute = require('./routes/admins');
const bodyParser = require('body-parser');


app.use('/users',userRoute)

app.use('/admins',adminRoute)


app.use("/public", express.static(path.join(__dirname, 'public')));







app.listen(process.env.PORT, () => {
    console.log(`App is listening at http://localhost:${process.env.PORT}`)
})