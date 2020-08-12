import React from "react";
import { isAuthenticated } from "../auth/helper";
// import { cartEmpty, loadCart } from "./helper/cartHelper"; TODO:
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  // const [data, setData] = useState({
  //   loading: false,
  //   success: false,
  //   error: "",
  //   address: "",
  // });

  // const token = isAuthenticated() && isAuthenticated().token;
  // const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;
    // if error accur replace for each with map
    products.forEach((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = { token, products };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        // call further
        const { status } = response;
        console.log("STATUS ", status);
        // cartEmpty();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey="pk_test_51GxYntFqDFsA1yrkXmvITRcuFwYPygJ6I8qaO5QjnYofVN0qQXzFgjiAO0Xun7xxuHn2XK1pRUOwtajY8cfX0pzi00qTddhXTQ"
        token={makePayment} // token is used to run a method // and method also have access to token by stripe
        amount={getFinalAmount() * 100} // 100 because we are working in sents so tp convert in doller we multply it with 100
        name="Buy Tshirt" // title of stripe popup
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };

  return (
    <div>
      <h3 className="text-white">stripe {getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
