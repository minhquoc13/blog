const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const expressRateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const winston = require("winston");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Logging middleware (using morgan)
app.use(morgan("combined"));

// Rate limiting middleware
const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB connection
const connectDb = require("./configs/connectDb");

connectDb(process.env.MONGODB_URI);

// route
const appRouter = require("./routes/index");
app.use("/api", appRouter);

const { errorHandler, notFound } = require("./middlewares/errorHandler");
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
