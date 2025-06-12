const User = require("../models/userModel.js");
const {
  acceptFPCodeSchema,
  changePasswordSchema,
} = require("../middlewares/validator.js");
const {doHashValidation, doHash} = require("../utils/hashing.js");
const {hmacProcess } = require("../utils/hashing.js");
const transport = require("../middlewares/sendMail.js")

const changePassword = async (req,res)=>{
  const {id,verified} = req.user;

  const {oldPassword, newPassword} = req.body;

  try{

    const {error, value} = changePasswordSchema.validate({oldPassword,newPassword});
    if(error){
      return res.status(401).json({success: false, message: error.details[0].message})
    }

    if(!verified){
      return res
        .status(401)
        .json({ success: false, message: "You are not a verified user" });
    
      }

    const user = await User.findOne({_id: id}).select("+password");
    if(!user){
      return res.status(401).json({success:false, message: "User does not exists!"})
    }

    const result = await doHashValidation(oldPassword, user.password)
    if(!result){
      return res.status(401).json({success:false, message: "Invalid credentials!"})
    }

    const hashedPassword = await doHash(newPassword,10);
    user.password = hashedPassword
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password updated" });
    
  }catch(error){
    console.log(error);
    
  }
}

const sendforgotPasswordCode = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "user does not exist!" });
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: user.email,
      subject: "Forgot password code",
      html: "<h1>" + codeValue + "</h1>",
    }
    );

    if (info.accepted[0] === user.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      user.forgotPasswordCode = hashedCodeValue;
      user.forgotPasswordCodeValidation = Date.now();
      await user.save();
      return res.status(200).json({ success: true, message: "Code sent" });
    }
    res.status(400).json({ success: false, message: "Code sent failed!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyforgotPasswordCode = async (req, res) => {
  const { email, providedCode, newPassword } = req.body;
  try {
    const { error, value } = acceptFPCodeSchema.validate({
      email,
      providedCode,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const codeValue = providedCode.toString();
    const user = await User.findOne({ email }).select(
      "+forgotPasswordCode +forgotPasswordCodeValidation"
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "user does not exist!" });
    }


    if (!user.forgotPasswordCode || !user.forgotPasswordCodeValidation) {
      return res
        .status(400)
        .json({ success: false, message: "something is wrong with the code!" });
    }

    if (Date.now() - user.forgotPasswordCodeValidation > 5 * 60 * 1000) {
      return res
        .status(400)
        .json({ success: false, message: "code has been expired" });
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );

    if (hashedCodeValue === user.forgotPasswordCode) {
      const hashedPassword = await doHash(newPassword,10);
      user.password = hashedPassword;
      user.forgotPasswordCode = undefined;
      user.forgotPasswordCodeValidation = undefined;
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Password updated" });
    }
    return res
      .status(400)
      .json({ success: true, message: "unexpected occured" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  changePassword,
  sendforgotPasswordCode,
  verifyforgotPasswordCode,
};