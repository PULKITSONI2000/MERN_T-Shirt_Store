const Category = require("../models/category");

// get a category by id Using param
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    // console.log("CATE ", cate);
    req.category = cate;
    // console.log(req.category);
    next(); //always remember where you place next()
  });
};

// create a category
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save category in DB",
      });
    }
    res.json({ category });
  });
};

// get a category
exports.getCategory = (req, res) => {
  // console.log(req.category);

  return res.json(req.category);
};

// get all category
exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No Categories Found",
      });
    }
    res.json(categories);
  });
};

// update a category
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed too update category",
      });
    }
    res.json(updatedCategory);
  });
};

// remove a category
exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to Delete this Category", // can also use ` ` to write name of category
      });
    }
    res.json({
      message: "Successfull Deleted",
    });
  });
};
