var express = require("express");

var router = express.Router();

const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

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
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, false, { messagr: "Email already in use" });
        }

        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.securePassword(password);
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

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user || !user.verifyPassword(password)) {
          return done(null, false, {
            message: "No user found with that email"
          });
        }

        return done(null, user);
      });
    }
  )
);

router.get("/signin", notLoggedIn, (req, res, next) => {
  res.render("user/signin");
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signin"
  })
);

router.get("/signup", notLoggedIn, (req, res, next) => {
  res.render("user/signup");
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup"
  })
);

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.send(req.user);
});

isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }

  res.redirect("/");
};

notLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  }

  res.redirect("/");
};

module.exports = router;
