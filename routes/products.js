const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');

router.post('/brandadd', productCtrl.brandAdd)

router.post('/categoriesadd', productCtrl.categoriesAdd)

router.post('/seriesadd',productCtrl.seriesAdd)

router.get('/getproduct',productCtrl.getProduct)


module.exports = router;