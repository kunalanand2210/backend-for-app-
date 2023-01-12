const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const jwtAuth = require('../middleware/middleware');

// passport setup for authentication //
var passport = require('passport');
require('../middleware/passport')(passport)

var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:false}));


router.get('/', (req , resp)=>{
  resp.send('hello user')
});

router.get('/list', passport.authenticate('jwt',{session:false}), userCtrl.userList);

router.post('/add', userCtrl.userAdd);

router.post('/login',userCtrl.userLogin);

router.patch('/update/:id', userCtrl.userUpdate);

module.exports = router;