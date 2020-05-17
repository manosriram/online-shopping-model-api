const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BuyerSc = new Schema({
    user_id: String,
    cart: [],
    orders: [],
    credits: {
        type: Number,
        default: 40000
    }
});

module.exports = Buyer = mongoose.model("Buyer", BuyerSc);
