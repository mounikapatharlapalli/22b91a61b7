require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB Connected");
  app.listen(process.env.PORT, () => {

    console.log(`Server running on ${process.env.BASE_URL}`);
  });
});
