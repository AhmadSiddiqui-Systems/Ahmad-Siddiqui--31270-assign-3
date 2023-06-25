const express = require('express')
const router = express.Router()
const {addToCart, getCart, updateCart, deleteCart} = require('../controllers/cartController')
const {verifyTokenForUser} = require('../middleware/auth')

router.post('/', verifyTokenForUser, addToCart)
router.get('/',verifyTokenForUser, getCart)
router.put('/:id',verifyTokenForUser, updateCart)
router.delete('/:id',verifyTokenForUser, deleteCart)


module.exports = router;