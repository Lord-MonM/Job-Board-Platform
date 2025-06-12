const jwt = require("jsonwebtoken")
const User = require("../models/userModel.js");
const {signUpSchema, signInSchema} = require("../middlewares/validator.js")
const { doHash, doHashValidation } = require("../utils/hashing.js");
const transport = require("../middlewares/sendMail.js")

const register = async (req, res) => {
  const { username, email, password, role, resume } = req.body;

  try {

    const {error, value} = signUpSchema.validate({email,password});

    if(error){
      return res.status(401).json({success: false, message: error.details[0].message});
    }
    const existing = await User.findOne({email});
    if(existing){
      return res.status(404).send("User already exists")
    }

    const hashedPassword = await doHash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, role, resume});

    await newUser.save();
    res
      .status(201)
      .json({ message: `User registered with email ${email}` });
    
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signInSchema.validate({ email, password });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({message: `User with email ${email} not found`});
    }

    const isMatch = await doHashValidation(password, user.password);
    if(!isMatch){
      return res
        .status(400)
        .json({message: `Invalid credentials`});
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, verified: user.verified},
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn:"8h"
      }
    );

    
    res.cookie("Authorization", "Bearer "+ token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
    }).json({
      sucess: true,
      token,
      message: "logged in successfully"
    })
  } catch (error) {
    res.status(500).json(error.message);
  
  }
}

const logout = async (req,res)=> {
  res.clearCookie("Authorization")
    .status(200)
    .json({success: true, message: "logged out successfully"})

}


module.exports = {
  register,
  login,
  logout,
}