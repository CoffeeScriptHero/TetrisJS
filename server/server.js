require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/main");
const secureRoutes = require("./routes/secure");
const cors = require("cors");

const URI = process.env.MONGO_CONNECTION_URL;

mongoose
  .connect(URI)
  .then(() => console.log("Database was connected"))
  .catch((err) => console.error(err));

const app = express();

app.use(cors({ origin: "*" }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(__dirname + "../../public"));
app.use("/", routes);
app.use("/", secureRoutes);

app.use((req, res, next) => {
  res.status(404);
  res.json({ message: "404 - Not Found" });
});

app.use((err, req, res, next) => {
  res.status(400);
  res.json({ error: 400, message: "все поломалось..." });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
