const express = require("express");
const app = express();
require("dotenv").config();
const PORT = 6060;
const mongoose = require("mongoose");
const url = `mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@ds231559.mlab.com:31559/zhiffy`;

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected !"))
    .catch(err => console.log(err));

app.use(express.json());
app.use("/api", require("./api.js"));

app.listen(PORT, () => console.log(`Server at ${PORT}`));

module.exports = app;
