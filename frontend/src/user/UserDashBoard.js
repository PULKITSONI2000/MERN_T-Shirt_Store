import React from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { useState } from "react";
import { getUser, updateUser } from "./helper/userapicalls";
import { useEffect } from "react";
import Card from "../core/Card";
import { Modal, Button } from "react-bootstrap";

const UserDashBoard = () => {
  const { user, token } = isAuthenticated();

  const [info, setInfo] = useState({
    name: "",
    email: "",
    purchases: [],
  });

  const [values, setValues] = useState({
    vname: "",
    vemail: "",
    error: "",
    success: false,
  });

  const { name, email, purchases } = info;
  const { vname, vemail, error, success } = values;

  const preload = () => {
    getUser(user._id, token)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setInfo({
            ...info,
            name: data.name,
            email: data.email,
            purchases: data.purchases,
          });
          setValues({
            vname: data.name,
            vemail: data.email,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //

  const handleChange = (name) => (event) => {
    // here what ever comes with name function it pass to event function
    // here function is treated as first level citision // like a variable

    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    handleClose();
    setValues({ ...values, error: false });
    updateUser(user._id, { name: vname, email: vemail }, token)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          setValues({ ...values, error: data.error, success: false });
        } else {
          setInfo({
            ...info,
            name: data.name,
            email: data.email,
            purchases: data.purchases,
          });
          setValues({
            ...values,

            error: "",
            success: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const successMessage = () => (
    <div className="row">
      <div className="col-md-6 offset-sm-3 text-left">
        <div
          className="alert alert-success"
          style={{ display: success ? "" : "none" }}
        >
          Account was Updated Successfully
          {/* <Link to="/signin">Login Here</Link> */}
        </div>
      </div>
    </div>
  );

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

  const UpdateForm = () => (
    <div>
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          {/* offset-3 moves the col-6 to 4th column  */}
          <form>
            <div className="form-group">
              <label className="text-light">Name</label>
              <input
                className="form-control"
                onChange={handleChange("vname")}
                type="text"
                value={vname}
              />
            </div>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                className="form-control"
                onChange={handleChange("vemail")}
                type="email"
                value={vemail}
              />
            </div>
            <button onClick={onSubmit} className="btn btn-success btn-block">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  //

  useEffect(() => {
    preload();
  }, []);

  //TODO: create component 1 show 2 update 3 producs

  return (
    <Base title="UserDashBoard Page" description="Manage your account here">
      <div className="card mb-4 container bg-success">
        <h4 className="card-header">User Information</h4>
        <ul className="list-group bg-dark">
          <li className="list-group-item bg-dark">
            <span className="badge badge-success mr-2">Name :</span>
            <span className="text-primary ml-3">{name}</span>
          </li>
          <li className="list-group-item bg-dark">
            <span className="badge badge-success mr-2">Email :</span>
            <span className="text-primary ml-3">{email}</span>
          </li>
          <li className="list-group-item bg-dark">
            <span className="badge badge-success mr-2">purchases :</span>
            <span className="row">
              {purchases.map((product, index) => {
                return (
                  <div
                    key={index}
                    className="col-12 col-sm-6 col-md-4 col-lg-3  mb-4"
                  >
                    <Card
                      product={product}
                      addtoCart={false}
                      removeFromCart={false}
                    />
                  </div>
                );
              })}
            </span>
          </li>
          <li className="list-group-item bg-dark">
            <div className="d-flex justify-content-center">
              <>
                <Button variant="primary" onClick={handleShow}>
                  Update
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header className="bg-dark" closeButton>
                    <Modal.Title className="text-success">
                      Update User
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="bg-dark">
                    {successMessage()}
                    {errorMessage()}
                    {UpdateForm()}
                  </Modal.Body>
                  <Modal.Footer className="bg-dark">
                    <Button variant="secondary" onClick={handleClose}>
                      Cancel
                    </Button>
                    {/* <Button variant="primary" onClick={handleClose}>
                      Update
                    </Button> */}
                  </Modal.Footer>
                </Modal>
              </>
            </div>
          </li>
        </ul>
      </div>
    </Base>
  );
};

export default UserDashBoard;
