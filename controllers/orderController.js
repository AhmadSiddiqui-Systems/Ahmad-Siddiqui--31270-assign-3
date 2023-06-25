const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const nodemailer = require('nodemailer')

const checkout = async (req, res) => {
  try {
    const user = req.user;

    // Get the user's cart
    const cart = await Cart.findOne({ user: user[0]._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const userDetails = {
        userId: user[0]._id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role,
        
    }

    const order = await Order.create({
        user: userDetails,
        items: cart.items,
        totalPrice: cart.totalPrice
      });

      // Delete user's cart
      await Cart.deleteOne({ _id: cart._id });

      const transporter = await nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ahmadsidonlineshop@gmail.com',
            pass: 'ahmad@12345'
        }
    });

    const mailOptions = {
          from: "ahmadsidonlineshop@gmail.com",
          to:  user[0].email,
          subject: "Order Confirmation",
          text: "Your order has been placed successfully."

        };
    
        await transporter.sendMail(mailOptions);
  
      res.json({ message: "Order placed successfully!", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = checkout;
