const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const maintenance = require("@zrpaplicacoes/maintenance_mode");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const swaggerUi = require("swagger-ui-express");
const specs = require("./server_helpers/swagger");
const {
  allLimiter,
  authLimiter,
  postLimiter,
  studentLimiter,
  clubLimiter,
  eventLimiter,
  maintenance_options,
} = require("./server_helpers/security");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(maintenance(app, maintenance_options));
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
const searchRoutes = require("./routes/search");
const getclubRoutes = require("./routes/getclubs");
// route them accordingly eg. app.use("/profile", profileRoutes)
app.use("/auth", authRoutes, authLimiter);
app.use("/posts", postRoutes, postLimiter);
app.use("/student", studentRoutes, studentLimiter);
app.use("/club", clubRoutes, clubLimiter);
app.use("/events", eventRoutes, eventLimiter);
app.use("/search", searchRoutes);
app.use("/getclubs", getclubRoutes); //returning the list of clubs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

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
