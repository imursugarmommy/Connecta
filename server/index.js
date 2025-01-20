const express = require("express");
const app = express();

app.use(express.json());

const db = require("./models");

//Routes
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

db.sequelize.sync().then(() => {
  app.listen(6969, () => {
    console.log("Server started on port 6969");
  });
});
