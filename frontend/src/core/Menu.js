import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, signout } from "../auth/helper";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#3ecc72" };
  } else {
    return { color: "#FFFFFF" };
  }
};
// to show current route

const Menu = ({ history }) => {
  return (
    <div>
      <nav className="navbar w-100  navbar-expand-lg navbar-dark bg-dark">
        <Link
          style={currentTab(history, "/")}
          className="navbar-brand text-2rem"
          to="/"
        >
          Logo
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav w-100">
            <li className="nav-item text-2rem mx-4">
              <Link
                style={currentTab(history, "/cart")}
                className="nav-link"
                to="/cart"
              >
                Cart
              </Link>
            </li>
            {isAuthenticated() && isAuthenticated().user.role === 0 && (
              <li className="nev-item text-2rem mx-4">
                <Link
                  style={currentTab(history, "/user/dashboard")}
                  className="nav-link"
                  to="/user/dashboard"
                >
                  User Dashboard
                </Link>
              </li>
            )}
            {isAuthenticated() && isAuthenticated().user.role === 1 && (
              <li className="nev-item text-2rem mx-4">
                <Link
                  style={currentTab(history, "/admin/dashboard")}
                  className="nav-link"
                  to="/admin/dashboard"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            {!isAuthenticated() && (
              <Fragment>
                <li
                  className="nev-item text-2rem"
                  style={{ marginLeft: "auto" }}
                >
                  <Link
                    style={currentTab(history, "/signup")}
                    className="nav-link"
                    to="/signup"
                  >
                    sign up
                  </Link>
                </li>
                <li className="nev-item text-2rem ">
                  <Link
                    style={currentTab(history, "/signin")}
                    className="nav-link"
                    to="/signin"
                  >
                    signin
                  </Link>
                </li>
              </Fragment>
            )}
            {isAuthenticated() && (
              <li
                className="nev-item text-2rem "
                style={{ marginLeft: "auto" }}
              >
                <span
                  className="nav-link text-warning"
                  onClick={() => {
                    signout(() => {
                      history.push("/");
                    });
                  }}
                >
                  Signout
                </span>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};
export default withRouter(Menu); // now menu can pick up all routes form routes.js file using links
