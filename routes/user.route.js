const express = require("express");
const auth = require("../middleware/auth");
const {
  getAllUser,
  getOneUser,
  loginUser,
  sendResetCode,
  resetUser,
  updateUser,
  deleteUser,
  registerUser,
  verifyUser,
  userLogged,
  logoutUser,
  updatePassword,
  registerAdmin,
  getAllUserByAdmin,
  loginAdmin,
  verifyUserByAdmin,
} = require("../controller/user.controller");

const profile = require("../middleware/profile");
const router = express.Router();

router.get("/", auth, getAllUser);
router.get("/admin", auth, getAllUserByAdmin);
router.get("/logged", auth, userLogged);
router.get("/:id", auth, getOneUser);
router.post("/register", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/login", loginUser);
router.post("/login/admin", loginAdmin);
router.post("/logout", auth, logoutUser);
router.post("/send", sendResetCode);
router.post("/reset", resetUser);
router.post("/verify", verifyUser);
router.patch("/verify/admin", auth, verifyUserByAdmin);
router.patch("/:id", auth, profile, updateUser);
router.patch("/password/:id", auth, updatePassword);
router.delete("/:id", auth, deleteUser);

module.exports = router;
