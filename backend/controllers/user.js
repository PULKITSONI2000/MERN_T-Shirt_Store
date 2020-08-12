const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined; // undefined values does not even shown up so it is best then assigning "" string
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

// +++ Assignment +++
//
// exports.getAllUser = (req, res) => {
//   User.find((err, users) => {
//     return res.json(users);
//   });
// };

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body }, //update the fields
    { new: true, usefindAndModify: false }, // compulsary parameter to pass when using .findByIdAndUpdate()
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update the user",
        });
      }
      user.salt = undefined; // undefined values does not even shown up so it is best then assigning "" string
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this account",
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchasaeList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  // store in db
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true }, // here {new: true} means send me back the updated one form DB not the old one
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};
