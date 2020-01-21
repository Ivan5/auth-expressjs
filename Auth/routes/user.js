var express = require("express");

var router = express.Router();

const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

router.post("/signup", (req, res, next) => {
  res.send(req.body);
});

module.exports = router;
