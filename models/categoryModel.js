const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sub_category: [
        {
            sub_name: {
                type: String,
                required: true
            },
            sub_brand:{
                type: String,
                required: true
            }
        }
    ]

}, {
    timestamps: true
})

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;