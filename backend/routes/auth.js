var express = require("express");

var router = express.Router();

const { check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "name should be of 3 character").isLength({ min: 3 }), // if error occur go to docs or use .withMessage('must be at least 5 chars long') after is length
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    // if error occur go to docs or use .withMessage('must be at least 5 chars long') after is length
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({
      min: 3,
    }),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
