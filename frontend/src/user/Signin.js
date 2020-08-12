import React, { useState } from "react";
import Base from "../core/Base";
import { Redirect } from "react-router-dom";

import { signin, authenticate, isAuthenticated } from "../auth/helper";

const Signin = () => {
  const [values, setValues] = useState({
    email: "d@gmail.com",
    password: "12345",
    error: "",
    loading: false,
    didRedirect: false,
  });

  const { email, password, error, loading, didRedirect } = values;
  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    // here what ever comes with name function it pass to event function
    // here function is treated as first level citision // like a variable

    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true }); // can also do "when loading is true submit button is off"
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            setValues({ ...values, didRedirect: true });
          }); // whenever there is next you can call up an callback
        }
      })
      .catch(console.log("SignIn request failed"));
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (isAuthenticated()) {
      // if user is authenticated and try to access admindashbord redirect him to homePage
      return <Redirect to="/" />;
    }
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const signInForm = () => (
    <div className="row">
      <div className="col-md-6 offset-sm-3 text-left">
        {/* offset-3 moves the col-6 to 4th column  */}
        <form>
          <div className="form-group">
            <label className="text-light">Email</label>
            <input
              value={email}
              onChange={handleChange("email")}
              className="form-control"
              type="email"
            />
          </div>
          <div className="form-group">
            <label className="text-light">Password</label>
            <input
              onChange={handleChange("password")}
              value={password}
              className="form-control"
              type="password"
            />
          </div>
          <button onClick={onSubmit} className="btn btn-success btn-block">
            Submit
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <Base title="Sign In page" description="A page for user to sign in">
      {loadingMessage()}
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
      <p className="text-white text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default Signin;
