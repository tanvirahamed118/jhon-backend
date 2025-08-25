const Prisma = require("../config/db.config");
const {
  OUTRO_RESPONSE,
  NAME_RESPONSE,
  SINGNATURE_RESPONSE,
} = require("../utils/response");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const membershipSecret = process.env.MEMBERSHIP_WEBHOOK_SECRET;
const testWebhookScecret = process.env.TEST_WEBHOOK;
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { ERROR_STATUS } = require("../utils/status");
const corsUrl = process.env.CORS_URL;
const supportMail = process.env.SUPPORT_MAIL;
const USER = process.env.EMAIL_USER;
const PASSWORD = process.env.EMAIL_PASSWORD;
const SERVER_KEY = process.env.EMAIL_SERVER_KEY;
const SERVER_PORT = process.env.EMAIL_SERVER_PORT;

async function membershipWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, membershipSecret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const transaction = await Prisma.userMembership.findFirst({
        where: {
          transactionId: session.id,
        },
      });

      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      const id = transaction?.id;
      const plan = transaction?.duration;
      const now = new Date();

      await Prisma.userMembership.update({
        where: {
          id: id,
        },
        data: {
          activate_at:
            plan === "monthly"
              ? new Date(now.getTime() + 5 * 60 * 1000).toISOString()
              : new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
                  .toISOString()
                  .replace("Z", "+00:00"),
          status: "ACTIVE",
        },
      });

      const existUser = await Prisma.user.findUnique({
        where: {
          id: transaction?.userId,
        },
      });
      const { landerName, email } = existUser || {};

      await sendNotificationEmail(landerName, email, plan);
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

async function sendNotificationEmail(companyName, email, plan) {
  let config = {
    host: SERVER_KEY,
    port: SERVER_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: USER,
      pass: PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(config);

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: NAME_RESPONSE,
      link: corsUrl,
      copyright: OUTRO_RESPONSE,
    },
  });

  const emailTemplate = {
    body: {
      name: `${companyName}`,
      intro: "You have recive a notification from MY BRAND LIFE",
      signature: SINGNATURE_RESPONSE,
      outro: `
        <p style="font-size: 20px; color: #777;">Congratulations 😄</p>
        <p style="font-size: 14px; color: #777;">Your membership has been activated. Please check your user dashboard to see your selected plan. You have chosen ${plan} plan.</p>
        <p style="font-size: 14px; color: #4285F4;"><a href="${corsUrl}">${NAME_RESPONSE}</a></p>
        <p style="font-size: 14px; color: #4285F4;">E-mail: ${supportMail}</p>
      `,
    },
  };
  const emailBody = mailGenerator.generate(emailTemplate);
  const mailOptions = {
    from: USER,
    to: email,
    subject: "Notification from My Brand Life",
    html: emailBody,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { membershipWebhook };
