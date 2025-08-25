const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient({
  //   log: ["query"],
});

module.exports = Prisma;
