const express = require("express");
const auth = require("../middleware/auth");
const {
  getAllContact,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  seenContact,
} = require("../controller/contact.controller");
const router = express.Router();

router.get("/", auth, getAllContact);
router.get("/:id", auth, getOneContact);
router.post("/", createContact);
router.put("/:id", auth, updateContact);
router.put("/status/:id", auth, seenContact);
router.delete("/:id", auth, deleteContact);

module.exports = router;
