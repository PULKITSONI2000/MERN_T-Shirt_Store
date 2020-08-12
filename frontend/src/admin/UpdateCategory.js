import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { getCategory, updateCategory } from "./helper/adminapicall";
import { Link } from "react-router-dom";

const UpdateCategory = ({ match }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [updatesCategory, setUpdatesCategory] = useState(false);

  const { user, token } = isAuthenticated();

  const preload = (categoryId) => {
    // console.log("category", categoryId);

    getCategory(categoryId)
      .then((data) => {
        // console.log("DATA", data);

        if (data.error) {
          setError(data.error);
        } else {
          setName(data.name);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    preload(match.params.categoryId); // when a param value is passed in a url then by this war you can acccess that is info
  });

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    updateCategory(match.params.categoryId, user._id, token, { name }) //{name}
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setName("");
          setUpdatesCategory(data.name);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (event) => {
    // if wanted to add more feature then follow update product method
    setError("");
    setName(event.target.value);
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: updatesCategory ? "" : "none" }}
    >
      <h4>{updatesCategory} Update Successfully</h4>
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

  const updateCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Enter the category</p>
          <input
            type="text"
            className="form-control my-3"
            onChange={handleChange} // if wanted to add more feature then follow update product method
            value={name}
            autoFocus
            required
            placeholder="For Ex. Summer"
          />
          <button onClick={onSubmit} className="btn btn-outline-info">
            Update Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Update category here"
      description="Welcome to Category Update section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {warningMessage()}
          {updateCategoryForm()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
