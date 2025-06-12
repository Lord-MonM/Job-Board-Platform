const Application = require("../models/applicationModel.js")
const Job = require("../models/jobModel.js")

const getEmployerApplications = async(req,res)=>{
  try{
    const jobs = await Job.find({ createdBy: req.user.id }).select("_id");

    if (!jobs) {
      return res.status(404).json({ message: "No job found for this user" });
    }

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ job: { $in: jobIds } }).sort({
      createdAt: -1,
    });

    res.json(applications);
  }catch(error){
    res.status(500).send(error.message);
  }
}

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    })
    res.json(applications);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getApplication = async (req,res)=> {
  try {
  
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).send("Application not found");
    }

    res.json(application);
  } catch (error) {
    res.status(500).send(error.message);
  }

}

const createApplication = async (req,res)=>{
  try {
    const {firstname, lastname,email,resume} = req.body
    const job = await Job.findById(req.params.id);
    if(!job){
      return res.status(404).send("Job not found");
    }
      const application = new Application({
        firstname: firstname,
        lastname: lastname,
        email: email,
        job: job._id,
        applicant: req.user.id,
        status: "applied",
        history: [
          {
            status: "applied",
            note: "Application submitted",
          },
        ],
        resume: req.file?.path || "" || resume,
      });
      await application.save();
      res.status(201).send("Application submitted");
    
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const application = await Application.findById(id.req.params);
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    application.status = status;
    application.history.push({ status, note });

    await application.save();

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteApplication = async(req,res)=>{
  const application = await Application.findById(req.params.id);

  if(!application){
    return res.status(404).send("Application does not exist");
  }

  await Application.deleteOne({ _id: req.params.id });
  res.status(200).json(order, { message: "Application deleted" });


}

module.exports = {
  getEmployerApplications,
  getMyApplications,
  getApplication,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
};