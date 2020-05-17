const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellerSc = new Schema({
    orders: []
});

module.exports = Seller = mongoose.model("Seller", SellerSc);
