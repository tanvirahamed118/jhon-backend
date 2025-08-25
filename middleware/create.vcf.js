// controllers/vcfController.js
const fs = require("fs");
const path = require("path");
const VCF = require("vcf");
const Prisma = require("../config/db.config");

/**
 * Express controller to generate VCF for a user
 */
const createVcfController = async (req, res) => {
  try {
    const { userId, templateId } = req.body;

    // Fetch user
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    const template = await Prisma.userTemplete.findUnique({
      where: { id: templateId },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { firstName, midName, lastName, email, phone, address, landerName } =
      user;
    const { tagLine } = template || {};

    // Handle uploaded files
    const logoPath = req.files?.logo ? req.files.logo[0].path : null;
    const portraitPath = req.files?.portrait
      ? req.files.portrait[0].path
      : null;

    const card = new VCF();

    // Basic info
    card.set(
      "fn",
      `${firstName || ""} ${midName || ""} ${lastName || ""}`.trim()
    );
    card.set("org", landerName || "");
    card.set("title", tagLine || "");
    card.set("email", email || "");
    card.set("tel", phone || "");

    // Address
    if (address) card.set("adr", ["", "", address, "", "", "", ""]);

    // Embed portrait as Base64
    if (portraitPath && fs.existsSync(portraitPath)) {
      const portraitData = fs.readFileSync(portraitPath).toString("base64");
      card.set("photo", portraitData, { encoding: "b", type: "JPEG" });
    }

    // Embed logo as Base64
    if (logoPath && fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath).toString("base64");
      card.set("logo", logoData, { encoding: "b", type: "JPEG" });
    }

    // Social links
    if (socialLinks && typeof socialLinks === "object") {
      for (const [key, value] of Object.entries(socialLinks)) {
        if (value) {
          card.set(`x-socialprofile;type=${key.toUpperCase()}`, value);
        }
      }
    }

    // Save VCF file
    const fileDir = path.join(__dirname, "../public");
    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });
    const fileName = `${firstName || "contact"}_${Date.now()}.vcf`;
    const filePath = path.join(fileDir, fileName);
    fs.writeFileSync(filePath, card.toString(), "utf-8");

    // Update template in DB with VCF path
    if (templateId) {
      await Prisma.userTemplete.update({
        where: { id: templateId },
        data: { vcfFile: filePath },
      });
    }

    // Return download link
    return res.status(200).json({
      success: true,
      message: "VCF file created successfully",
      downloadPath: `${req.protocol}://${req.get("host")}/public/${fileName}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = createVcfController;
