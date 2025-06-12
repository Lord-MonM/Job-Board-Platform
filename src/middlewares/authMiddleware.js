const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const verifyToken = asyncHandler( async (req, res, next) => {
  let token;

  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }else if(req.cookies && req.cookies.Authorization){
    const cookieValue = req.cookies.Authorization;
    if(cookieValue.startsWith("Bearer ")){
      token = cookieValue.split(" ")[1];
    }else{
      token = cookieValue;
    }
  }
  if (!token) {
    res.status(401);
    return res.status(401).json("User is not authorized or token is missing");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
  
});

module.exports = verifyToken;
