const express = require("express");
const router = express.Router();
const Buyer = require("./Models/Buyer.js");
const JSON = require("./MOCK_DATA.json");
const Order = require("./Models/Orders.js");

router.get("/checkout", async (req, res) => {
    try {
        const { user_id } = req.headers;
        if (!user_id)
            return res.status(403).json({ message: "Not Authenticated" });

        const PRD = await Buyer.findOne({ user_id });
        let ord;

        ord = await Order.findOne({ user_id });
        if (!PRD) return res.status(400).json({ message: "No user found" });

        if (!ord) ord = new Order({ user_id });
        let cost = 0;
        for (let t = 0; t < PRD.cart.length; ++t)
            cost +=
                JSON[PRD.cart[t].product_id - 1].price * PRD.cart[t].quantity;

        if (cost > PRD.credits)
            return res.status(403).json({ message: "Not enough credits" });

        PRD.credits -= cost;
        PRD.orders = [...PRD.orders, { cart: PRD.cart, cost }];
        ord.orders.push(PRD.cart);
        ord.save();

        PRD.cart = [];
        PRD.save();
        return res.json({ cost });
    } catch (err) {
        res.status(404).json({ message: "Some error occured" });
    }
});

router.post("/remove_from_cart", async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { product_id } = req.body;
        if (!product_id || product_id < "0")
            return res.status(406).json({ message: "Bad credentials." });

        if (!user_id)
            return res.status(403).json({ message: "Not Authenticated" });

        const product = await Buyer.findOne({ user_id });
        product.cart = product.cart.filter(prd => prd.product_id != product_id);
        product.save();

        return res.status(200).json({ cart: product.cart });
    } catch (err) {
        res.status(404).json({ message: "Some error occured" });
    }
});

router.post("/add_to_cart", async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { product_id, quantity } = req.body;

        if (!user_id)
            return res.status(403).json({ message: "Not Authenticated" });
        if (!product_id || !quantity)
            return res.status(406).json({ message: "Bad credentials." });
        const prod = await Buyer.findOne({ user_id });

        var new_prod;
        if (!prod) {
            new_prod = new Buyer({
                user_id
            });
        } else new_prod = prod;
        new_prod.cart.push({
            product_id,
            quantity
        });
        new_prod.save();
        let cost = 0;
        for (let t = 0; t < new_prod.cart.length; ++t) {
            cost +=
                JSON[new_prod.cart[t].product_id - 1].price *
                new_prod.cart[t].quantity;
        }

        return res.status(200).json({ cart: new_prod.cart, total_cost: cost });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Some error occured" });
    }
});

router.get("/view_orders", async (req, res) => {
    try {
        const { user_id } = req.headers;

        if (!user_id)
            return res.status(403).json({ message: "Not Authenticated" });

        const CRT = await Buyer.findOne({ user_id });
        return res.status(200).json({ orders: CRT.orders });
    } catch (err) {
        res.status(404).json({ message: "Some error occured" });
    }
});

router.get("/view_cart", async (req, res) => {
    try {
        const { user_id } = req.headers;

        if (!user_id)
            return res.status(403).json({ message: "Not Authenticated" });

        let new_user;
        new_user = await Buyer.findOne({ user_id });
        if (!new_user) new_user = new Buyer({ user_id });

        new_user.save();
        return res.status(200).json({ cart: new_user.cart });
    } catch (err) {
        res.status(404).json({ message: "Some error occured" });
    }
});

router.get("/view_store", (req, res) => {
    return res.status(200).json({ store: JSON });
});

router.get("/account_summary", async (req, res) => {
    try {
        const { user_id } = req.headers;
        if (!user_id)
            return res.status(403).json({ message: "Not Authenticated" });

        const prod = await Buyer.findOne({ user_id });
        return res.status(200).json({ prod });
    } catch (err) {
        res.status(404).json({ message: "Some error occured" });
    }
});

router.post("/add_credits", async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { credits } = req.body;

        if (!user_id)
            return res.status(403).json({ message: "Not Authenticated" });
        if (!credits)
            return res.status(406).json({ message: "Bad Credentials" });

        const prod = await Buyer.findOne({ user_id });
        prod.credits += parseInt(credits);
        prod.save();

        return res
            .status(200)
            .json({ message: `Added credits. Balance ${prod.credits}` });
    } catch (err) {
        res.status(404).json({ message: "Some error occured" });
    }
});

router.get("/view_all_orders", async (req, res) => {
    const ord = await Order.find({});
    return res.status(200).json({ orders: ord });
});

module.exports = router;
