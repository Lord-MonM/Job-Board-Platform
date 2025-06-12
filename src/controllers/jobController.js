const Job = require("../models/jobModel.js")
const User = require("../models/userModel.js");


const getAllJobs = async (req, res)=> {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs)
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getJob = async (req, res)=> {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).send("Job not found");
    }
    res.json(job);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const createJob = async (req, res)=> {
  try {
    console.log("req.users:", req.user);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    console.log("id:"+ req.user.id);
    const job = new Job({...req.body, createdBy: req.user.id});
    await job.save();
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const updateJob = async (req, res)=> {
  try {
    const job = await Job.findById(req.params.id);
    if(!job){
      res.status(404).send("Job not found")
    }
    const updatedJob = await Job.findOneAndUpdate(req.params.id, req.body,{new: true});

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const deleteJob = async (req, res)=> {
  if (req.user.role !== "employer" || "admin")
    return res.status(403).send("Access denied");
  const job = await Job.findById(req.params.id);
  if(!job){
    res.status(404).send("Job not found");
  }
  await Job.deleteOne({_id: req.params.id});
  res.status(200).send("Job deleted")
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}