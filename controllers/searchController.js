const Product = require('../models/productModel')

const search = async (req, res) => {
    try {
        const searchQuery = req.query.search; // Get the search query from the URL parameter

  // Search for products
  const products = await Product.find({
    $or: [
      { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on title
      { description: { $regex: searchQuery, $options: "i" } } // Case-insensitive search on description
    ]
  }).populate("category", "-sub_category");

  // Send the search results as a response
  res.json(products);
    } catch (error) {
        res.send(error)
    }
}

module.exports = search;