require("dotenv").config();
const jwt = require("jsonwebtoken");
const { ERROR_STATUS } = require("../utils/status");
const { UNAUTHORIZE_ERROR_MESSAGE } = require("../utils/response");
const secretKey = process.env.SECRET_KEY;

const auth = (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: UNAUTHORIZE_ERROR_MESSAGE,
      });
    }
    const user = jwt.verify(token, secretKey);
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: UNAUTHORIZE_ERROR_MESSAGE,
      error: error.message,
    });
  }
};

module.exports = auth;
