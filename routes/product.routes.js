const express = require('express');
const router = express.Router();
const checkAuth  = require('../middleware/auth')

const productControllers = require('../controllers/product.controller');
const singleUpload = require('../middleware/multer');

router.post('/create' ,checkAuth, singleUpload, productControllers.createProduct)
router.get('/get' ,checkAuth, productControllers.getProduct)
router.get('/:id' ,checkAuth, productControllers.getProductById)
router.put('/update/:id' ,checkAuth, productControllers.updateProduct)
router.delete('/delete/:id' ,checkAuth, productControllers.deleteProduct)


module.exports = router;