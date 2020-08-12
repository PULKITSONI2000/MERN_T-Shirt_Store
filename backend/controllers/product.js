const Product = require("../models/product");

const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");
const category = require("../models/category");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    //MongoDB has the join-like $lookup aggregation operator in versions >= 3.2. Mongoose has a more powerful alternative called populate(), which lets you reference documents in other collections.
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    // destructure the fields
    const { name, description, price, category, stock } = fields;

    // restriction on fileds
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    } // expross Validation (restriction) is best (top notch level) so use it instead of this

    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //  3mb = 3 * 1024 * 1024 = 3000000

        return res.status(400).json({
          error: "file size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving in DB failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined; //block for performence optomization
  return res.json(req.product);
};

// middelware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// delete controllers
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedProduct,
    });
  });
};

// update controller
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    // updation code
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //  3mb = 3 * 1024 * 1024 = 3000000

        return res.status(400).json({
          error: "file size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product fail",
        });
      }
      res.json(product);
    });
  });
};

// product listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8; // im major languages querry is passed in string format
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]]) // for sorting
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product found",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct(
    "category",
    {
      /* clicks: {$gt: 100} // condition  */
    },
    (err, category) => {
      if (err) {
        return res.status(400).json({
          error: "NO category found",
        });
      }
      res.json(category);
    }
  );
};

exports.updateStock = (req, res, next) => {
  let myOperation = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperation, {}, (err, products) => {
    // bulkWrite can perform multiple operation at same time in db
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation failed",
      });
    }
    next();
  });
};
