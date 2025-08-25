const Prisma = require("../config/db.config");
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  SINGNATURE_RESPONSE,
  MESSAGE_SEND_SUCCESSFUL_MESSAGE,
  OUTRO_RESPONSE,
  IGNORE_EMAIL_RESPONSE,
  NAME_RESPONSE,
} = require("../utils/response");
const { ERROR_STATUS, SUCCESS_STATUS } = require("../utils/status");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const supportMail = process.env.SUPPORT_MAIL;
const corsUrl = process.env.CORS_URL;
const USER = process.env.EMAIL_USER;
const PASSWORD = process.env.EMAIL_PASSWORD;
const SERVER_KEY = process.env.EMAIL_SERVER_KEY;
const SERVER_PORT = process.env.EMAIL_SERVER_PORT;

// get all contacts
async function getAllContact(req, res) {
  const { page = 1, limit = 10, searchBy, verify } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const filter = {};
  if (searchBy) {
    filter.name = searchBy;
  }
  if (verify) {
    filter.seen = verify === "seen" ? true : false;
  }
  try {
    const contact = await Prisma.contact.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
    });
    const totalContact = await Prisma.contact.count({ where: filter });
    const totalPage = Math.ceil(totalContact / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        contact,
        totalPage,
        totalContact,
        currentPage: pageNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one contacts
async function getOneContact(req, res) {
  const id = req.params.id;
  try {
    const existContact = await Prisma.contact.findUnique({
      where: {
        id: id,
      },
    });
    if (!existContact) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      contact: existContact,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get create contacts
async function createContact(req, res) {
  const { name, email, message, subject, phone } = req.body;
  try {
    const newMessage = await Prisma.contact.create({
      data: {
        name: name,
        email: email,
        message: message,
        subject: subject,
        phone: phone,
      },
    });
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
    let mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "MY BRAND LIFE",
        link: corsUrl,
        copyright: OUTRO_RESPONSE,
      },
    });

    let emailTemplate = {
      body: {
        name: `MY BRAND LIFE`,
        intro: `You have received a email request from ${name}`,
        signature: SINGNATURE_RESPONSE,
        outro: `
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">User full name:</strong>
          <p style="font-size: 14px; color: #555;">${name}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">User email:</strong>
          <p style="font-size: 14px; color: #555;">${email}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">User message:</strong>
          <p style="font-size: 14px; color: #555;">${message}</p>
        </div>
        <p style="font-size: 14px; color: #777;">${IGNORE_EMAIL_RESPONSE}</p>
        <p style="font-size: 14px; color: #4285F4;"><a href="${corsUrl}">${NAME_RESPONSE}</a></p>
        <p style="font-size: 14px; color: #4285F4;">E-mail: ${supportMail}</p>
      `,
      },
    };
    const emailBody = mailGenerator.generate(emailTemplate);
    const mailOptions = {
      from: USER,
      to: USER,
      subject: "Email request received",
      html: emailBody,
    };
    await transporter.sendMail(mailOptions);
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: MESSAGE_SEND_SUCCESSFUL_MESSAGE,
      contact: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get update contacts
async function updateContact(req, res) {
  const id = req.params.id;
  const { name, email, message, subject, phone } = req.body;

  try {
    const existContact = await Prisma.contact.findUnique({
      where: {
        id: id,
      },
    });
    if (!existContact) {
      res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.contact.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        message: message,
        subject: subject,
        phone: phone,
      },
    });

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      contact: existContact,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// seen message
async function seenContact(req, res) {
  const { id } = req.params;
  try {
    const existContact = await Prisma.contact.findUnique({
      where: {
        id: id,
      },
    });
    if (!existContact) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.contact.update({
      where: {
        id: id,
      },
      data: {
        seen: true,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get delete contacts
async function deleteContact(req, res) {
  const id = req.params.id;
  try {
    const existContact = await Prisma.contact.findUnique({
      where: {
        id: id,
      },
    });
    if (!existContact) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const deleteContact = await Prisma.contact.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      contact: deleteContact,
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

module.exports = {
  getAllContact,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  seenContact,
};
