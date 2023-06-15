const express = require("express");
const app = express();
const route = require("./route/route");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://rupalikumari:JInaXFAjWKId5h19@cluster0.8qeleal.mongodb.net/", { useNewUrlParser: true, }).then(() => {
    console.log("You have connected with your mongoDB")
}).catch((err) => console.log("There is some problem in mongoose connection", { error: err }))

app.use("/", route);

app.listen(process.env.PORT || 3001, () => {
  console.log(
    "Your server running on port " + (process.env.PORT || 3001)
  );
});

module.exports = app;