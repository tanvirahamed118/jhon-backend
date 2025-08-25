const express = require("express");
const {
  HOME_ROUTE_MESSAGE,
  ROUTE_NOT_FOUND_MESSAGE,
  CORS_ERROR_MESSAGE,
} = require("./utils/response");
const errorHandler = require("./middleware/error.handler");
const { ERROR_STATUS, SUCCESS_STATUS } = require("./utils/status");
const auth = require("./middleware/auth");
const app = express();
const UserRouter = require("./routes/user.route");
const WebhookRouter = require("./routes/webhook.route");
const ContactRouter = require("./routes/contact.route");
const OnboardRouter = require("./routes/onboard.route");
const cors = require("cors");
const CORS_URL = process.env.CORS_URL;
const DOMAIN_URL = process.env.DOMAIN_URL.split(",");
const allowedOrigins = [CORS_URL, ...DOMAIN_URL];
const cookieParser = require("cookie-parser");
const closeMemberhsip = require("./middleware/close.membership");
const cron = require("node-cron");

// app middlewares
app.use("/webhook", WebhookRouter);
app.use(cookieParser());
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(CORS_ERROR_MESSAGE));
      }
    },
    credentials: true,
  })
);

// expired membership
cron.schedule("0 0 * * *", () => {
  closeMemberhsip();
});

// all routes
app.use("/api/auth", UserRouter);
app.use("/api/onboard", OnboardRouter);
app.use("/api/contact", ContactRouter);

// Home Route
app.get("/", auth, (req, res) => {
  res.status(200).json({
    status: SUCCESS_STATUS,
    message: HOME_ROUTE_MESSAGE,
  });
});

// error middleware
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({
    status: ERROR_STATUS,
    message: ROUTE_NOT_FOUND_MESSAGE,
  });
});

module.exports = app;
