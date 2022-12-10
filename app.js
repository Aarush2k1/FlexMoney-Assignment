require("./models/db");

const path = require("path");
const express = require("express");
const bodyparser = require("body-parser");

const User = require("./models/userModel");

const app = express();

app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(bodyparser.json());

const viewsPath = path.join(__dirname, "/public/views");
const publicDirectoryPath = path.join(__dirname, "/public");

app.set("view engine", "hbs");
app.set("views", viewsPath);

app.use(express.static(publicDirectoryPath));

// localhost:3000/
app.get("/", (req, res) => {
  res.render("index");
});

//localhost:3000/post
var name;
var email;
var password;
var phone;
var age;
var batch;

app.post("/user", async (req, res) => {
  name = req.body.name;
  email = req.body.email;
  password = req.body.password;
  phone = req.body.phone;
  age = req.body.age;
  batch = req.body.batch;

  try {
    if (age < 18 || age > 65) {
      throw "Age should be between 18 and 65";
    }

    if (phone.length != 10) {
      throw "Invalid Phone";
    }

    res.render("payment_page", {
      name: req.body.name,
      age: req.body.age,
      batch: req.body.batch,
    });
  } catch (e) {
    res.status(400).send(e);
    console(e);
  }
});

app.post("/payment", async (req, res) => {
  console.log(req.body);
  var user = new User(req.body);
  console.log(user);
  user.name = name;
  user.email = email;
  user.password = password;
  user.phone = phone;
  user.age = age;
  user.batch = batch;

  try {
    await user.save();
    res.render("success_page");
  } catch (e) {
    res.status(400).send(e);
    console(e);
  }
});

app.listen(3000, () => {
  console.log("Server is Up and Running");
});
