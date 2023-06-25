const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()

const URI = process.env.MONGO_URI

const connectDb = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Database Connected Successfully!')
    } catch (error) {
        console.log('Failed to Connect Database!')
    }
}

module.exports = connectDb;