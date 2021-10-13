const path = require('path');

const express = require('express');

// controllers, contains all the function we want to execute
// based on the type of method of the request
const adminController = require('../controllers/admin');

// router is used to handle request with different methods
const router = express.Router();

// /admin/
router.get('/', (req, res, next)=>{
    res.redirect('/admin/add-product')
})

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// exporting the router
module.exports = router;
