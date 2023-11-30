require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const URL = process.env.ATLAS_URI;

/*-------------------------------------------------------------*/

app.use(cors());
app.use(express.json());

/*-------------------------------------------------------------*/

mongoose
  .connect(URL)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.error(err);
  });

const TodoSchema = new mongoose.Schema({
  id: Number,
  name: String,
  complete: Boolean,
});

const TodoModel = mongoose.model("todo", TodoSchema, "todos");

/*-------------------------------------------------------------*/

app.get("/", (req, res) => {
  res.send("<h1>Todos Database</h1>");
});

/*-------------------------------------------------------------*/

app.get("/todos", async (req, res) => {
  try {
    let todos = await TodoModel.find({}, {});
    res.status(200).json(todos);
  } catch (error) {
    res.status(404).json({ Message: "Data Not found" });
  }
});

/*-------------------------------------------------------------*/

app.post("/todos", async (req, res) => {
  try {
    let todo = new TodoModel(req.body);
    if (!todo.name) {
      return res.status(404).json({ Message: "Data Not found" });
    }
    todo = await todo.save();
    res.status(200).json({ message: "New todo added Successfully" });
  } catch (error) {
    res.status(404).json({ Message: "Data Not found" });
  }
});

/*-------------------------------------------------------------*/

app.delete("/todos/:id", async (req, res) => {
  let id = req.params.id;
  //   TodoModel.findById(id).then((data) => {
  //     console.log(data);
  //   });
  try {
    let deleteTodo = await TodoModel.findById(id);
    deleteTodo = await deleteTodo.deleteOne();
    res.status(200).json({ message: "Todo deleted Successfully" });
  } catch (error) {
    res.status(404).json({ Message: "Data Not found" });
  }
});

/*-------------------------------------------------------------*/

app.patch("/todos/:id", async (req, res) => {
  let id = req.params.id;
  let updatedTodo = req.body;
  try {
    await TodoModel.findByIdAndUpdate(id, updatedTodo);
    res.status(200).json({ message: "Todo updated Successfully" });
  } catch (error) {
    res.status(404).json({ Message: "Data Not found" });
  }
});

/*-------------------------------------------------------------*/

app.listen(3001, () => {
  console.log("server is running");
});
