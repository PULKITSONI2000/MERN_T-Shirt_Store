// start mongodb server --> "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe"

require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//  My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");

const app = express();

// DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

// Middlewares
app.use(bodyParser.json()); //bodyParser is used in post request to fetch data from req.body
app.use(cookieParser());
app.use(cors()); // cors are used to cross origen resource share // must be added

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
// port
const port = process.env.PORT || 8000;

// Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
