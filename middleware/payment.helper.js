const {
  createMyStudentLifePayment,
  createMyRestrurentLifePayment,
  createMyInfluencerLifePayment,
  createMyDjLifePayment,
} = require("./payment.creators");

async function paymentHelper(user) {
  let createPayment;
  const { planKey, planPrice, planOldPrice, frequency, planId, id, domain } =
    user || {};

  // mydjlife.me
  if (domain === "mydjlife.me") {
    createPayment = await createMyDjLifePayment(
      planKey,
      planPrice,
      frequency,
      planOldPrice,
      planId,
      id
    );
  }

  // myinfluencerlife.me
  if (domain === "myinfluencerlife.me") {
    createPayment = await createMyInfluencerLifePayment(
      planKey,
      planPrice,
      frequency,
      planOldPrice,
      planId,
      id
    );
  }

  // mystudentlife.me
  if (domain === "mystudentlife.me") {
    createPayment = await createMyStudentLifePayment(
      planKey,
      planPrice,
      frequency,
      planOldPrice,
      planId,
      id
    );
  }

  // myrestrurentlife.me
  if (domain === "myrestrurentlife.me") {
    createPayment = await createMyRestrurentLifePayment(
      planKey,
      planPrice,
      frequency,
      planOldPrice,
      planId,
      id
    );
  }

  return createPayment?.pageUrl;
}

module.exports = paymentHelper;
