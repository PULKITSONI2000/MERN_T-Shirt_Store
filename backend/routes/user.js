const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById); // when ever there is anything inside :something then this method automaticly pipulate it wuth userID
// this param middleware is always fireup when /:userId is passedin other request

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

// router.get("/users", getAllUser);  // Assignment

module.exports = router;
