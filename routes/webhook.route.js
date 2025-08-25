const express = require("express");
const { membershipWebhook } = require("../controller/webhook.controller");
const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), membershipWebhook);

module.exports = router;
