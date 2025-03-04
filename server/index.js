const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());

const db = require("./models");

// static file serving
app.use("/images/posts", express.static(path.join(__dirname, "images/posts")));
app.use("/images/users", express.static(path.join(__dirname, "images/users")));

//Routes
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const userRouter = require("./routes/Users");
app.use("/users", userRouter);

const commentRouter = require("./routes/Comments");
app.use("/comments", commentRouter);

const likeRouter = require("./routes/Likes");
app.use("/likes", likeRouter);

db.sequelize.sync().then(() => {
  app.listen(6969, () => {
    console.log("Server started on port 6969");
  });
});
