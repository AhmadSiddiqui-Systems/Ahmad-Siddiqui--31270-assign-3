const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      userId: {
        type: String
      },
      name: {
        type: String
      },
      email: {
        type: String
      },
      role: {
        type: String
      },
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;