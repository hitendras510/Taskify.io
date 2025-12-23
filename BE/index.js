const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "as21sa1"
const mongoose = require("mongoose");

const app = express();
const {UserModel, TodoModel} = require("./db");
mongoose.connect("mongodb+srv://hitendra_123:RQBc7Hz9HErmaQbO@cluster0.cicgyky.mongodb.net/");
app.use(express.json()); //can't parse json body without this

app.post("/signup",async function(req,res){
   await UserModel.insertMany({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    res.json({
        message: "You are logged in successfully"
    })
})

app.post("/signin", async function(req,res){
const user = await UserModel.findOne({
    email: req.body.email,
    password: req.body.password
})
if(user){
    const token = jwt.sign({
        id: user._id
    }, JWT_SECRET)
    res.json({
        message: "You are logged in successfully",
        token: token
    })
}else{
    res.status(403).json({
        message: "Invalid credentials"
    })
}
console.log(user)
})

app.post("/todo", function(req,res){

})

app.get("/todos", function(req,res){

})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})