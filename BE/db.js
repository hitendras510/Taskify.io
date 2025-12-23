const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = new Schema({
    name: String,
    email: String,
    password: String
})
const todo = new Schema({
  title: String,
  done: Boolean,
  userId: ObjectId
})

//in which collection we want to store our data
const UserModel = mongoose.model("users", User);
const TodoModel = mongoose.model("todos", todo);

module.exports = { 
    UserModel: UserModel,
    TodoModel: TodoModel 
};