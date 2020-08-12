import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import {
  getCategories,
  getProduct,
  updateProduct,
} from "./helper/adminapicall";
import Base from "../core/Base";
import { Link } from "react-router-dom";

const UpdateProduct = ({ match }) => {
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false, // TODO: Assignment wait for 2 sec then redirect to admin home page
    error: "",
    createdProduct: "", // only for pop up your data is created
    getaRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    // category,
    // loading,
    error,
    createdProduct,
    // getaRedirect, //Assign. set a boolian kind of value for this
    formData,
  } = values;

  const preload = (productId) => {
    getProduct(productId)
      .then((data) => {
        // console.log(data);

        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          preloadCategories();
          setValues({
            ...values,
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category._id,
            stock: data.stock,
            formData: new FormData(),
          });

          //   console.log("CATE: ", categories);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const preloadCategories = () => {
    getCategories()
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            categories: data,
            formData: new FormData(),
          });
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    preload(match.params.productId); // when a param value is passed in a url then by this war you can acccess that is info
  });

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    updateProduct(match.params.productId, user._id, token, formData)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            stock: "",
            photo: "",
            loading: false,
            createdProduct: data.name,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (name) => (event) => {
    const value = // event.target.file[0] is store if it is image in value
      name === "photo"
        ? event.target.files[0] // for image fields // this means path of file so we can load it here
        : event.target.value; // for other then image fields
    formData.set(name, value); // here name is key and value is value according to name key
    setValues({ ...values, [name]: value });
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h4>{createdProduct} Update Successfully</h4>
    </div>
  );
  const warningMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: error ? "" : "none" }}
    >
      <h4>Failed to update | Error : {error}</h4>
    </div>
  );

  const updateProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option> //if you are repeating any thing there must be a unique key to every value
            ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Product
      </button>
    </form>
  );

  return (
    <Base
      title="Update product here"
      description="Welcome to product Update section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {warningMessage()}
          {updateProductForm()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateProduct;
