import React, { useState, useEffect } from "react";
import "../styles.css";
// import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import StripeCheckout from "./StripeCheckout";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false); // used to reload the page // because when state is change react reload the page

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProduct = (products) => {
    return (
      <div>
        <h2>this section is to load product</h2>
        {products.map((product, index) => {
          return (
            <Card
              key={index}
              product={product}
              removeFromCart={true}
              addtoCart={false}
              setReload={setReload} // passing setReload and reload to update so that page is updated
              reload={reload}
            />
          );
        })}
      </div>
    );
  };
  // const loadCheckout = () => {
  //   return (
  //     <div>
  //       <h2>this section for checkout</h2>
  //     </div>
  //   );
  // };

  return (
    <Base title="Cart Page" description="Ready to checkout">
      {/* due to children component whater you pass in base component act as an children and can be use as children keyword */}

      <div className="row text-center">
        <div className="col-6">
          {products.length > 0 ? (
            loadAllProduct(products)
          ) : (
            <h3>No product in cart</h3>
          )}
        </div>
        <div className="col-6">
          <StripeCheckout products={products} setReload={setReload} reload />
        </div>
      </div>
    </Base>
  );
};
export default Cart;
