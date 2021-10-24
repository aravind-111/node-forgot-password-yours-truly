const express = require("express");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const user = {
  email: "aravind@gmail.com",
  password: "lakskowkslkdoaklkd!@ddsf.sda",
  userId: "sfdjdr8374lskdjd",
};

const JWT_SECRET = "jdsahdjsah23274dhfsh";

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/forgot-password", (req, res, next) => {
  res.render("forgot-password");
});

app.post("/forgot-password", (req, res, next) => {
  const { email } = req.body;
  if (email !== user.email) {
    res.send("user doesnt exist");
    return;
  }

  // Since now user exist we have to generate a link for reseting the password
  const secret = JWT_SECRET + user.password;
  const payload = {
    email: user.email,
    userId: user.userId,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const link = `http://localhost:5000/reset-password/${user.userId}/${token}`;
  console.log(link);
  res.send("link to reset the password has been sent");
});

app.get("/reset-password/:userId/:token", (req, res, next) => {
  const { userId, token } = req.params;

  // check weather user exists
  if (userId !== user.userId) {
    res.send("user doesnt exist");
    return;
  }

  const secret = JWT_SECRET + user.password;

  // check weather token is matching
  try {
    const payload = jwt.verify(token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

app.post("/reset-password/:userId/:token", (req, res, next) => {
  const { userId, token } = req.params;
  const { password, password2 } = req.body;

  // check if its the right user
  if (user.userId !== userId) {
    res.send("incorrect user");
    return;
  }

  const secret = JWT_SECRET + user.password;

  // check if the token is correct
  try {
    const payload = jwt.verify(token, secret);
    if (password === password2) {
      user.password = password;
      res.send(user);
    } else {
      res.send("password doesnt match");
    }
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});

app.listen(5000, () => {
  console.log("server connected in port 5000");
});
