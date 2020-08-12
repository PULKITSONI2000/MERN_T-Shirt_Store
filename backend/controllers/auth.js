const User = require("../models/user");
const { check, validationResult } = require("express-validator");

var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      // using ifelse lader is good it gives more accurate message
      return res.status(400).json({
        error: "USER email does not exists",
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    // create token
    const token = jwt.sign({ _id: user.id }, process.env.SECRET); // this secret is use later to test isSignin

    // put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // sent response to front end
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout Successfully",
  });
};

// protected routes
exports.isSignedIn = expressJwt({
  // SignedIn means you can look around peofiles
  secret: process.env.SECRET,
  // algorithms: ["HS256"],
  userProperty: "auth",
  // auth contains userId in encripted form
});

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
  // authenticate means you can change your profile
  let chacker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!chacker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access Denied",
    });
  }
  next();
};
