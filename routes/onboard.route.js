const express = require("express");
const auth = require("../middleware/auth");
const {
  onboardingUser,
  updateTempleteSocial,
  updateTempleteMedias,
  updateTempleteInfos,
  deleteTemplete,
  checkDiscountCode,
  requestADomain,
  getAllOnboard,
  getOneOboard,
  recreatePayment,
  getOneOboardById,
  updateMemebership,
  getAllOnboardByAdmin,
  verifyOnboard,
  requestInfo,
  requestInfoLocation,
} = require("../controller/onboard.controller");
const medias = require("../middleware/medias");
const router = express.Router();
const createVcfController = require("../middleware/create.vcf");

router.get("/", auth, getAllOnboard);
router.get("/admin", auth, getAllOnboardByAdmin);
router.get("/:id", auth, getOneOboardById);
router.get("/wirframe/:name", getOneOboard);
router.post("/", auth, medias, onboardingUser);
router.post("/createvfc", auth, medias, createVcfController);
router.post("/recreate/:id", auth, recreatePayment);
router.post("/request", requestADomain);
router.post("/request/info", requestInfo);
router.post("/request/info/location", requestInfoLocation);
router.post("/discount", checkDiscountCode);
router.put("/images/:id", auth, medias, updateTempleteMedias);
router.put("/social/:id", auth, updateTempleteSocial);
router.put("/info/:id", auth, updateTempleteInfos);
router.put("/membership/:id", auth, updateMemebership);
router.put("/verify/:id", auth, verifyOnboard);
router.delete("/:id", auth, deleteTemplete);

module.exports = router;
