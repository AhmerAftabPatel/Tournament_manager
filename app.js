require("dotenv").config();
const http = require('http');
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//my routes
const authRoutes = require("./routes/authentication");
const userRoutes = require("./routes/user");
const tournamentRoutes = require("./routes/tournament")
// const { isSignedIn } = require('./controllers/authentication');

// DBconnected
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB Connected");
  });
// middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", tournamentRoutes);

// port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
