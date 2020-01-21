var express = require("express");

var router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

router.post("/signup", (req, res, next) => {
  res.send(req.body);
});

module.exports = router;
