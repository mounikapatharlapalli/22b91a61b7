const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const logger = require("../Logging-Middleware/log");
const shortenerRoutes = require("./routes/shortener");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/", shortenerRoutes);

module.exports = app;
