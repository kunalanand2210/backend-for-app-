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


app.use('/users',userRoute)

// app.post('/login', async (req, resp) => {
//      if (req.body.email && req.body.password) {
              
//           let user = await User.findOne(req.body).select("-password");
//               if(user){
//                  resp.send(user);
//               } else{
               
//                resp.send({result : 'You enter either email or password wrong'});
//               }
          
//      } else {
//           resp.send({ result: 'please enter and password completely' })
//      }
// });

// app.post('/register', async (req, resp) => {
//      if (req.body.email && req.body.name && req.body.mobile && req.body.password) {
              
//               let user = await User.findOne({ email : req.body.email});
//               if(user){
//                  resp.send({result : 'Email is Already in use with registration'});
//               } else{
//                let user1 = new User(req.body);
//                let result = await user1.save();
//                resp.send({result : 'You register Successfully'});
//               }
          
//      } else {
//           resp.send({ result: 'please fill all the input fields and try again !' })
//      }
// });


app.listen(process.env.PORT, () => {
    console.log(`App is listening at http://localhost:${process.env.PORT}`)
})