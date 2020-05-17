const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSc = new Schema({
    user_id: String,
    cart: [],
    orders: [],
    credits: {
        type: Number,
        default: 40000
    }
});

module.exports = Product = mongoose.model("Product", ProductSc);
