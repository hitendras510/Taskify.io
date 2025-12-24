require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { UserModel, TodoModel } = require("./db");

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
  await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.json({
    message: "Signup successful",
  });
});

app.post("/signin", async function (req, res) {
  const user = await UserModel.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (!user) {
    return res.status(403).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    message: "Signin successful",
    token,
  });
});

app.get("/todo", auth, (req,res)=>{
 const userId = req.userId;
 res.json({
  userId: userId,
 })
})

app.get("/todos", auth ,(req,res) => {
 const userId = req.userId;
 res.json({
  userId: userId,
 })
}) 



function auth(req,res,next){
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_SECRET);

  if(decodedData){
    req.userId = decodedData.userId;
    next();
  }else{
    res.status(403).json({
      message: "Invalid token",
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
