const express = require('express');
const router = express.Router();
const checkAuth  = require('../middleware/auth')

const productControllers = require('../controllers/product.controller');
const singleUpload = require('../middleware/multer');

router.post('/create' , singleUpload, productControllers.createProduct)
router.get('/get' , productControllers.getProduct)
router.get('/:id' , productControllers.getProductById)
router.put('/update/:id' , singleUpload, productControllers.updateProduct)
router.delete('/delete/:id' , productControllers.deleteProduct)
// router.delete('/delete/:id' ,checkAuth, productControllers.deleteProduct)



module.exports = router;