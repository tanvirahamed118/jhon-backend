const multer = require("multer");
const fs = require("fs");

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "public";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    cb(null, fileName);
  },
});

const upload = multer({
  storage: Storage,
});

const medias = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "portrait", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "background", maxCount: 1 },
  { name: "epkFile", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "FooterBg", maxCount: 1 },
  { name: "ContentBg", maxCount: 1 },
  { name: "headerBg", maxCount: 1 },
]);

module.exports = medias;
