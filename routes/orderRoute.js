const express = require('express')
const router = express.Router()
const checkout = require('../controllers/orderController')
const {verifyTokenForUser} = require('../middleware/auth') 

router.post('/', verifyTokenForUser, checkout);

module.exports = router;