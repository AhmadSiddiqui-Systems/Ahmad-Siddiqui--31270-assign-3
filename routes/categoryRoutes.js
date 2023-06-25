const express = require('express');
const router = express.Router()
const {verifyToken} = require("../middleware/auth")

const {createCategory, getCategory, updateCategory, deleteCategory} = require('../controllers/categoryController')

router.get('/', getCategory);
router.post('/',verifyToken, createCategory);
router.put('/:id',verifyToken, updateCategory);
router.delete('/:id',verifyToken, deleteCategory);


module.exports = router