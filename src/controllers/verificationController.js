const User = require("../models/userModel.js");
const {acceptCodeSchema} = require("../middlewares/validator.js")
const {hmacProcess } = require("../utils/hashing.js");
const transport = require("../middlewares/sendMail.js")




const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "user does not exist!" });
    }

    if (user.verified) {
      return res
        .status(401)
        .json({ success: false, message: "you are already verified!" });
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: user.email,
      subject: "Verification code",
      html: "<h1>" + codeValue + "</h1>",
    });

    if (info.accepted[0] === user.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      user.verificationCode = hashedCodeValue;
      user.verificationCodeValidation = Date.now();
      await user.save();
      return res.status(200).json({ success: true, message: "Code sent" });
    }
    res.status(400).json({ success: false, message: "Code sent failed!" });
  } catch (error) {
    console.log(error.message);
  }
};


const verifyVerificationCode = async(req, res)=>{
  const {email, providedCode} = req.body;
  try{
    const { error, value } = acceptCodeSchema.validate({email, providedCode});
    if(error){
      return res.status(401).json({success: false, message: error.details[0].message})
    }
    const codeValue = providedCode.toString()
    const user = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation"
    );

    if(!user){
      return res
        .status(401)
        .json({ success: false, message: "user does not exist!" });
    }

    if(user.verified){
      return res.status(400).json({success:false, message:"You are already verified!"})
    }
    
    if (!user.verificationCode || !user.verificationCodeValidation) {
      return res
        .status(400)
        .json({ success: false, message: "something is wrong with the code!" });
    }

    if(Date.now() - user.verificationCodeValidation > 5* 60 *1000){
      return res
        .status(400)
        .json({ success: false, message: "code has been expired" });
    }

    const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

    if(hashedCodeValue === user.verificationCode){
      user.verified = true;
      user.verificationCode = undefined;
      user.verificationCodeValidation = undefined;
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "your account has been verified" });
    }
    return res
      .status(400)
      .json({ success: true, message: "unexpected occured" });

  }catch(error){
    console.log(error);
    
  }
}

module.exports = {
  sendVerificationCode,
  verifyVerificationCode
}