const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const jwtAuth = require('../middleware/middleware');

const upload = require('../middleware/multer');

// passport setup for authentication //
var passport = require('passport');
require('../middleware/passport')(passport)

var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended:false}));


router.get('/', (req , resp)=>{
  resp.send('hello')
});

router.get('/list', passport.authenticate('jwt',{session:false}), userCtrl.userList);

router.get('/userdata/:id', userCtrl.userData);

router.get('/userServiceList/:id', userCtrl.userServiceList);

router.post('/add', userCtrl.userAdd);

router.post('/login',userCtrl.userLogin);


const cpUpload = upload.upload.fields([{ name: 'invoice', maxCount: 1 }, { name: 'issue_image', maxCount: 4 }, { name: 'under_warranty', maxCount: 1 }])
router.post('/update/:id', cpUpload , userCtrl.userUpdate);

// router.post('/update', upload.upload , userCtrl.userUpdate);


module.exports = router;