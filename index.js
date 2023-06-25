const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDb = require('./db/connectDb')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoute = require('./routes/orderRoute')
const searchRoute = require('./routes/searchRoute')

connectDb()
app.use(express.json())
dotenv.config()
const Port = process.env.PORT || 3000;



// All Routes
app.get("/", (req, res) => {
    res.send("Server is running...")
})

app.use(userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", orderRoute);
app.use("/product", searchRoute);



app.listen(Port, () => {
    console.log(`Server is Live on port ${Port}`)
})