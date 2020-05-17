const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSc = new Schema({
    user_id: String,
    orders: []
});

module.exports = Order = mongoose.model("Order", OrderSc);
