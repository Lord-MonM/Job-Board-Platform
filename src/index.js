const express = require("express");
const bodyParser = require("body-parser");
const { default: helmet } = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit")
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect.js");
const authRouter = require("./routes/authRoutes.js")
const userRouter = require("./routes/userRoutes.js")
const jobRouter = require("./routes/jobsRoutes.js")
const applicationRouter = require("./routes/applicationRoutes.js")
const dotenv = require("dotenv").config();


const app = express();

//connect DB
dbConnect();

//Middleware
app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
// app.use(xss());


//Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);

//Start the server

const port = process.env.PORT || 5004;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
