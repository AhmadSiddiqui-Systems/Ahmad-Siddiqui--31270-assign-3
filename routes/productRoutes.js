const express = require("express")
const router = express.Router()
const {createProduct, getProducts, updateProduct, deleteProduct} = require('../controllers/productController');
const {verifyToken} = require('../middleware/auth')

router.post("/",verifyToken, createProduct);
router.get("/", getProducts);
router.put("/:id",verifyToken, updateProduct);
router.delete("/:id",verifyToken, deleteProduct);

module.exports = router;