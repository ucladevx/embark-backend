const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const maintenance = require("@zrpaplicacoes/maintenance_mode");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
require("dotenv").config();

//  all limiters used in app
const allLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
});
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
});
const studentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 100 requests per windowMs
});
const clubLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
});
const eventLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 100 requests per windowMs
});

//  maintenance mode settings
const options = {
  mode: false,
  /**Hot-Switch options below
   * endpoint: false,
   * url: '/maintenance',
   * accessKey: 'CHANGE_ME',
   */
  status: 503,
  message: "Sorry, Embark is on maintenance, please check back later",
  checkpoint: "/status",
  retryAfter: 30,
};

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(maintenance(app, options));
app.use(xss());
app.use(mongoSanitize());
app.set("secretKey", process.env.JWT_SECRET);

const PORT = process.env.PORT || 9000;

//  list all routes here, such as profileRoutes, messageRoutes, etc.
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const studentRoutes = require("./routes/student");
const clubRoutes = require("./routes/club");
const eventRoutes = require("./routes/events");

// route them accordingly eg. app.use("/profile", profileRoutes)
app.use("/auth", authRoutes, authLimiter);
app.use("/posts", postRoutes, postLimiter);
app.use("/student", studentRoutes, studentLimiter);
app.use("/club", clubRoutes, clubLimiter);
app.use("/events", eventRoutes, eventLimiter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (req, res) => {
  res.status(200).send({
    message: `GET /health on Port ${PORT} successful`,
  });
});

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Connected to database");
  } catch (err) {
    console.log(err);
    console.log("Could not connect to database. Exiting...");
    process.exit(1);
  }
};

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

connectToDB();
