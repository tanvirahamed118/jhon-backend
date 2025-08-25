const Prisma = require("../config/db.config");

function calculateExpiry(activateAt, duration, status) {
  const start = new Date(activateAt);
  if (duration === "monthly" && status === "ACTIVE") {
    return new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
  } else if (duration === "yearly" && status === "ACTIVE") {
    return new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
  } else {
    throw new Error("Invalid membership duration");
  }
}

async function closeMemberhsip() {
  try {
    const memberships = await Prisma.userMembership.findMany({
      where: { expired: false },
    });

    const now = new Date();

    for (const membership of memberships) {
      const expiryDate = calculateExpiry(
        membership.activate_at,
        membership.duration,
        membership?.status
      );

      if (expiryDate <= now) {
        await Prisma.userMembership.update({
          where: { id: membership.id },
          data: { expired: true, status: "EXPIRED" },
        });
      }
    }
  } catch (error) {
    console.error("Error closing memberships:", error?.message);
  }
}

module.exports = closeMemberhsip;
