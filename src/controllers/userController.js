const User = require("../models/userModel.js");


const getAllUsers = async (req, res)=> {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users)
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getUser = async (req, res)=> {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}


const updateUser = async (req, res)=> {
  try {
    const user = await Job.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    }
    const updatedUser = await User.findOneAndUpdate(req.params.id, req.body,{new: true});

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const deleteUser = async (req, res)=> {
  const user = await Job.findById(req.params.id);
  if (!user) {
    res.status(404).send("User not found");
  }
  await User.deleteOne({_id: req.params.id});
  res.status(200).send("User deleted")
}

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
}