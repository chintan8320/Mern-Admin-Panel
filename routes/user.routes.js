const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user.controller.js')

router.post('/register',userControllers.registerUser )
router.post('/login',userControllers.loginUser )
router.post('/wishList' ,userControllers.addWishList )
router.post('/orders' ,userControllers.addOrder )
router.get('/:userId' ,userControllers.getWishList )
router.delete('/:userId/wishlist/:productId',userControllers.removeWishList);
router.delete('/:userId/orders/:productId',userControllers.removeOrders);
router.delete('/:userId/oneorders/:productId',userControllers.removeOneOrders);
router.get('/orders/:userId' ,userControllers.getOrders )

module.exports = router;