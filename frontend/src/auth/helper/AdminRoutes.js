import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

const AdminRoute = ({ component: Component, ...rest }) => {
  // component come from routes.js
  return (
    <Route
      {...rest}
      render={(
        props // for location // can also be destructure as {location}
      ) =>
        isAuthenticated() && isAuthenticated().user.role === 1 ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

// this function is used as a route in routes.js here everything is come
// and according to our condision we render component

export default AdminRoute;
