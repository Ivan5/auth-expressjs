var express = require("express");

var router = express.Router();

const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, passport, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (Err) {
          return done(err);
        }

        if (user) {
          return done(null, false, { messagr: "Email already in use" });
        }

        var newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.save((err, user) => {
          if (err) {
            return done(err);
          }

          return done(null, user);
        });
      });
    }
  )
);

router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup"
  })
);

router.get("/profile", (req, res, next) => {
  res.send(req.user);
});

module.exports = router;
