const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

router.get("/", function (req, res) {
  res.json({ items })   //items in fakeDb.js??
});

router.post("/", function (req, res, next) {
    try {
      if (!req.body.name) throw new ExpressError("Name is required", 400);
      const newItem = { item: req.body.name, price: req.body.price}
      items.push(newItem)
      return res.status(201).json({ name: newItem })
    } catch (e) {
      return next(e)
    }
  })

router.get("/:name", function (req, res, next) {
  const foundItem = items.find(item => item.item.toLowerCase() === req.params.name.toLowerCase());
  console.log("Found item:", foundItem);
  if (!foundItem) {
    throw new ExpressError("Item not found", 404)
  }
  res.json({ item: foundItem })
  next();
});

router.patch("/:name", function (req, res) {
  const foundItem = items.find(item => item.item.toLowerCase() === req.params.name.toLowerCase());
  if (!foundItem ) {
    throw new ExpressError("Item not found", 404)
  }
  if(req.body.item) {
  foundItem.item = req.body.item;
  }
  if(req.body.price) {
  foundItem.price = req.body.price;
  }
  res.json({ item: foundItem  })
});

router.delete("/:name", function (req, res) {
    const foundItem = items.findIndex(item => item.item.toLowerCase() === req.params.name.toLowerCase());
    if (foundItem === -1) {
      throw new ExpressError("Item not found", 404)
    }
    items.splice(foundItem, 1)
    res.json({ message: "Deleted" })
  })
  

module.exports = router;