const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const jwtAuth = require('../middleware/middleware');


var passport = require('passport');
require('../middleware/adminPassport')(passport)

var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:false}));

// admin api route start here //

router.post('/add', passport.authenticate('jwt',{session:false}), adminCtrl.adminAdd);

router.get('/list', passport.authenticate('jwt',{session:false}), adminCtrl.adminList);

router.get('/list/:id',passport.authenticate('jwt',{session:false}), adminCtrl.adminListId);

router.get('/service/:brand', adminCtrl.adminServiceList);

router.post('/servicestatus/:id', adminCtrl.serviceStatus);

router.get('/adminservicerecord/:id', adminCtrl.adminServiceRecord);

router.post('/paymentdelete/:id', adminCtrl.paymentDelete);

router.get('/installation', adminCtrl.adminInstallationList);

router.post('/login', adminCtrl.adminLogin);

router.put('/edit/:id', passport.authenticate('jwt',{session:false}), adminCtrl.adminEdit);

router.post('/paymentupdate/:id', passport.authenticate('jwt',{session:false}), adminCtrl.paymentdetailUpdate);

router.get('/servicedetail/:id', adminCtrl.serviceDetails);

// api for dashboard page (for some quick information)
router.get('/dashboarddata', adminCtrl.dashboardData);

router.get('/paymentlist',  adminCtrl.paymentList);

router.get('/paymentdetail/:id',  adminCtrl.paymentDetail);




module.exports = router;