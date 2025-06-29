import mongoose from "mongoose";
import connectDB from "./src/mongodb.js";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  password: String
});

const taskSchema = new mongoose.Schema({
  userId: String,
  task: String
})

const Task =  mongoose.model("task",taskSchema)

const User = mongoose.model("User", UserSchema);

// Root Route (optional)
app.post("/tasks", async (req, res) => {
  const { userId } = req.body;

  try {
    const tasks = await Task.find({ userId }); 
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to fetch", details: error.message });
  }
});

// Add User Route
app.post("/addUser", async (req, res) => {
  const { name, password } = req.body;

  try {
    const newUser = new User({ name, password });
    await newUser.save();

    res.status(200).json({
      message: "✅ User added successfully",
      userId: newUser._id,
    });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to add user", details: err.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({ error: "❌ Invalid credentials (user not found)" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "❌ Invalid credentials (wrong password)" });
    }

    res.status(200).json({
      message: "✅ User auth successful",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ error: "❌ Server error", details: err.message });
  }
});


app.post("/addTask", async(req,res)=>{
  const {userId , task} = req.body;

  try{
    const newTask =  new Task({userId,task})
    await newTask.save();

    res.status(200).json({message: "task added"})
  }
  catch(err){
    res.status(500).json({error: err})

  }
})

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
