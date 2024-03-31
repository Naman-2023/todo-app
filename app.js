const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "css")));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
  name: String,
};

// Item Model
const Item = mongoose.model("Item", itemSchema);

// Sample items
const item1 = new Item({ name: "Om Sam Sidhaya Namah" });
const item2 = new Item({ name: "Om Namo Kalkine" });
const item3 = new Item({ name: "Om Eem Ishputray Namah" });


app.get("/", async function (req, res) {
  try {
    const items = await Item.find({});
    if (items.length === 0) {
      await Item.insertMany([item1, item2, item3]);
      console.log("Successfully saved items to database");
      res.redirect("/");
    } else {
      res.render("list", { newListItem: items });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", function (req, res) {
  const itemName = req.body.n;
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndDelete(checkedItemId)
    .then(() => {
      console.log("Successfully deleted");
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
});

app.listen(port, function () {
  console.log("Server is running on port " + port);
});
