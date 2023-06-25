const Product = require('../models/productModel')
const jwt = require('jsonwebtoken')


//////// Create the product /////////////

const createProduct = async (req, res) => {
    const { title, description, price, stock, category} = req.body;

    if(!title || !description || !price || !stock || !category){
        return res.send("Plz fill al the fields!")
    }

    try {
        const productExist = await Product.findOne({ title })

        if(productExist){
            return res.json({message: "Product Already Existed!"})
        }
        else{
            const product = await Product.create({
                title, description, price, stock, category
            })
        
            return res.json({message: "New Product Created Successfully!", product})
        }
      
    } catch (error) {
        res.send(error)
    }
   
}

//////// Get the product /////////////

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ }).populate('category', { sub_category: 0})
        
        return res.json({products})
    } catch (error) {
        res.send(error)
    }
}

  //////// Update the product /////////////

const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const {title, description, price, stock, category} = req.body;
    try {
        const updatedData = {
            title,
            description,
            price,
            stock,
            category 
        };

        await Product.findByIdAndUpdate(productId, updatedData);
        res.json({ message: "Product Updated!" })
    } catch (error) {
        res.send(error)
    }
}

//////// Delete the product /////////////

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.find({_id: id})

        if(product){
            const deleted = await Product.deleteOne({ _id: id })
            if(deleted){
                res.json({ message: "Product Deleted!" })
            }
        }else{
            res.json({error: "Product not Found!"})
        }
    } catch (error) {
        res.send(error)
    }
}


module.exports = {createProduct, getProducts, updateProduct, deleteProduct};