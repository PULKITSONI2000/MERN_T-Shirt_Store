import React, { useState, useEffect } from "react";
import "../styles.css";
// import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";

export default function Home() {
  // console.log("API IS", API);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  // TODO: create error condition

  const loadAllProduct = () => {
    getProducts()
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadAllProduct();
  }, []);

  return (
    <Base title="Home Page" description="Welcome to the Tshirt Store">
      {/* due to children component whater you pass in base component act as an children and can be use as children keyword */}

      <div className="row text-center">
        <h1 className="text-white">All of Tshirt</h1>
        <div className="row">
          {error ? (
            <h1>No product found</h1> //TODO:
          ) : (
            products.map((product, index) => {
              return (
                <div
                  key={index}
                  className="col-12 col-sm-6 col-md-4 col-lg-3  mb-4"
                >
                  <Card product={product} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </Base>
  );
}
