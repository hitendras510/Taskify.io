require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { UserModel, TodoModel } = require("./.db/db");

const app = express();

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// DB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Routes
app.post("/signup", async function (req, res) {
  const hashedPasswords = await bcrypt.hash(req.body.password, 5);
  await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPasswords,
  });

  res.json({
    message: "Signup successful",
  });
});

app.post("/signin", async function (req, res) {
  const user = await UserModel.findOne({
    email: req.body.email,
    password: hashedPasswords,
  });
  const response = await UserModel.findOne({
    email: req.body.email,
    password: hashedPasswords,
  });

  if (!response) {
    return res.status(403).json({
      message: "Invalid credentials",
    });
  }
  const passwordMatch = await bcrypt.compare(
    req.body.password,
    response.password
  );

  if (!passwordMatch) {
    return res.status(403).json({
      message: "Invalid credentials",
    });
  }

  if(passwordMatch){
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      message: "Signin successful",
      token,
    });
  }else{
    return res.status(403).json({
      message: "Invalid credentials",
    });
  }
});

app.post("/todo", auth, async (req, res) => {
  const userId = req.userId;
  const title = req.body.title;
  await TodoModel.create({
    title,
    userId,
  });
  res.json({
    message: "Todo created successfully",
  });
});

app.get("/todos", auth, async (req, res) => {
  const userId = req.userId;
  const todos = await TodoModel.find({
    userId: userId,
  });
  res.json({
    message: "Todos fetched successfully",
    todos,
  });
});

function auth(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_SECRET);

  if (decodedData) {
    req.userId = decodedData.id;
    next();
  } else {
    res.status(403).json({
      message: "Invalid token",
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
