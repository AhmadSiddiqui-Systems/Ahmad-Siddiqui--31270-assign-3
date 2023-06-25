const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')



//////////// Add To Cart  //////////

const addToCart = async (req, res) => {
  const { userId, items } = req.body;

  if(!userId || !items){
    return res.json({ message: "Plz Provide all information required To Add in the Cart!" })
}

    try {
  
      const user = await User.findOne({ _id: userId });
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
  
      const cartItems = [];
      let totalPrice = 0;
      const updateOperations = [];
  

      for (const item of items) {
          const { itemId, quantity } = item;
  
          const product = await Product.findOne({ _id: itemId });
          if (!product) {
           return res.status(404).json({message: `Product with ID ${itemId} not found`});
          }
    
          if (product.stock < quantity) {
            return res.status(400).json({message: `Insufficient stock for product with ID ${itemId}`});
            
          }
    
          const cartItem = {
            item: product._id,
            quantity: quantity,
          };
    
          cartItems.push(cartItem);
          totalPrice += product.price * quantity;

    
          updateOperations.push({
            updateOne: {
              filter: { _id: itemId },
              update: { $inc: { stock: -quantity } },
            },
          });
        }

      const cart = await Cart.create({
        user: user._id,
        items: cartItems,
        totalPrice: totalPrice,
      });

    
      await Product.bulkWrite(updateOperations);
  
      res.json({message: "Items Added in the Cart"});
    } catch (err) {
      console.error('Error adding items to cart:', err);
      res.status(500).send('Internal Server Error');
    }

}

//////////// Get Cart  //////////

const getCart = async (req, res) => {
    try {
      const user = req.user;
  
      const cart = await Cart.findOne({ user: user[0]._id })
  
      if (!cart) {
        return res.json({ message: "Your Cart is Empty!" });
      }
  
      res.json(cart);
    } catch (err) {
      console.error("Error retrieving cart items:", err);
      res.status(500).send("Internal Server Error");
    }
}

//////////// Update Cart  //////////

const updateCart = async (req, res) => {
  const cartItemId = req.params.id;
  const updatedItem = req.body;

  if(!cartItemId || !updatedItem){
    return res.json({ message: "Plz Provide all information required To Update the Cart!" })
}
  try {
    const existingItem = await Cart.findOne({ _id: cartItemId });
    if (!existingItem) {
      res.status(404).send('Cart item not found');
      return;
    }

    const { itemId, quantity } = updatedItem;
 
    const product = await Product.findOne({ _id: itemId });
    if (!product) {
      res.status(404).send('Product not found');
      return;
    }
    const existItem = existingItem.items.find(ele =>{
      if(ele.item == itemId){
        return ele.quantity
      }

    })

    const quantityDiff = Number(quantity) - Number(existItem.quantity);
    const index = existingItem.items.indexOf(existItem)

    if (product.stock < quantityDiff) {
      res.status(400).send('Insufficient stock');
      return;
    }

    await Cart.updateOne(
      { _id:  existingItem._id},
      {
        "$set": {
          "totalPrice": existingItem.totalPrice - product.price * -quantityDiff,
          [`items.${index}.item`]: existItem.item,
          [`items.${index}.quantity`]: quantity
        }
      }
    )

    await Product.updateOne({ _id: itemId }, { $inc: { stock: -quantityDiff } });

    res.json({ message: "Cart Updated!" });
  } catch (err) {
    console.error('Error updating item in cart:', err);
    res.status(500).send('Internal Server Error');
  }
}

//////////// Delete Cart  //////////

const deleteCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    const existingItem = await Cart.findOne({ _id: cartItemId });
    if (!existingItem) {
      res.status(404).send('Cart item not found');
      return;
    }

    const itemsToUpdate = existingItem.items.map(item => ({
      itemId: item.item._id,
      quantity: item.quantity
    }));

    // Delete the cart
    await Cart.deleteOne({ _id: cartItemId });
    
    // Update the product quantities
    itemsToUpdate.map(async (itemEle) =>
      await Product.updateOne(
        { _id: itemEle.itemId },
        { $inc: { stock: itemEle.quantity } }
      )
    );

    res.json({ message: "Cart Deleted!" });
  } catch (err) {
    console.error('Error deleting item from cart:', err);
    res.status(500).send('Internal Server Error');
  }
}


module.exports = {addToCart, getCart, updateCart, deleteCart}