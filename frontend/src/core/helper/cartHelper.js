export const addItemToCart = (item, next) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
      // item in localStorage are store in JsonString so we have to convert it into object
      //The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string.
    }
    cart.push({
      ...item,
      count: 1,
    });
    console.log(JSON.stringify(cart));

    localStorage.setItem("cart", JSON.stringify(cart));
    //The JSON.stringify() method converts a JavaScript object or value to a JSON string
    next();
  }
};

export const loadCart = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
};

export const removeItemformCart = (productId) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
      // item in localStorage are store in JsonString so we have to convert it into object
      //The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string.
    }
    cart.forEach((product, index) => {
      if (product._id === productId) {
        cart.splice(index, 1);
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart;
};

export const cartEmpty = (next) => {
  if (typeof window !== undefined) {
    localStorage.removeItem("cart");
    next();
  }
};
