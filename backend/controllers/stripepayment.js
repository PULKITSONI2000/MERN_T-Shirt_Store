const stripe = require("stripe")(
  "sk_test_51GxYntFqDFsA1yrkTQjrpTwmW1FEy9hlD2hCsWvs3QzKZ72Yz4sjebwjlrmOTLkc6EmKA0BrFyiqy0UDN0jrDpdZ004LGKu7Ga"
);
const uuid = require("uuid/v4");

exports.makepayment = (req, res) => {
  const { products, token } = req.body;
  console.log("Products ", products);

  let amount = 0;
  products.map((p) => {
    amount = amount + p.price;
  });
  const idempotencyKey = uuid(); // so that user not charges more then one due to network issue

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "a test account",

            shipping: {
              name: token.card.name, // read docs for more
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });
};
