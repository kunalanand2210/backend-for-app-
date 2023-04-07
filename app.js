const express = require('express');
const app = express();

const bodyParser = require('body-parser');

var cors = require('cors');
app.use(cors());

app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb", extended : true}));

app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit:"50mb", extended : true}));

// use passport initiallization here
const passport = require('passport');
app.use(passport.initialize());

const path = require('path');
require('dotenv').config({  
    path: path.join(__dirname,'.env')
})

const userRoute = require('./routes/users');

const adminRoute = require('./routes/admins');

const productRoute = require('./routes/products');


app.use('/users',userRoute)

app.use('/admins',adminRoute)

app.use('/products',productRoute)


app.use("/public", express.static(path.join(__dirname, 'public')));







app.listen(process.env.PORT, () => {
    console.log(`App is listening at http://localhost:${process.env.PORT}`)
})