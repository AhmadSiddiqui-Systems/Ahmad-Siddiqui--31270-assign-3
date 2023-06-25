const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
 },
 items: [
    {
      item: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
     },
      quantity: {
        type: Number,
      },
    }
  ],
  totalPrice: {
    type: Number,
  },


}, {
    timestamps: true
})

const Cart = mongoose.model("Cart", cartSchema)
module.exports = Cart;