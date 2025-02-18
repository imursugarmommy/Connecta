const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

//Routes
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const userRouter = require("./routes/Users");
app.use("/users", userRouter);

const commentRouter = require("./routes/Comments");
app.use("/comments", commentRouter);

db.sequelize.sync().then(() => {
  app.listen(6969, () => {
    console.log("Server started on port 6969");
  });
});
