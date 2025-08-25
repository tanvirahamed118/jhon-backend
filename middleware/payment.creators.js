const Prisma = require("../config/db.config");
const {
  INVALID_PLAN_MESSAGE,
  QUERY_SUCCESSFUL_MESSAGE,
} = require("../utils/response");
const { ERROR_STATUS } = require("../utils/status");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const baseURL = process.env.CORS_URL;
const testPlans = {
  BRONZE_MONTHLY: process.env.TEST_PLAN,
};
const myDjLifePricing = {
  BRONZE_MONTHLY: process.env.MY_DJ_LIFE_BRONZE_MONTHLY_PRICING_ID,
  BRONZE_YEARLY: process.env.MY_DJ_LIFE_BRONZE_YEARLY_PRICING_ID,
  SILVER_MONTHLY: process.env.MY_DJ_LIFE_SILVER_MONTHLY_PRICING_ID,
  SILVER_YEARLY: process.env.MY_DJ_LIFE_SILVER_YEARLY_PRICING_ID,
  GOLD_MONTHLY: process.env.MY_DJ_LIFE_GOLD_MONTHLY_PRICING_ID,
  GOLD_YEARLY: process.env.MY_DJ_LIFE_GOLD_YEARLY_PRICING_ID,
  PLATINUM_MONTHLY: process.env.MY_DJ_LIFE_PLATINUM_MONTHLY_PRICING_ID,
  PLATINUM_YEARLY_1ST: process.env.MY_DJ_LIFE_PLATINUM_1ST_YEARLY_PRICING_ID,
  PLATINUM_YEARLY_2ND: process.env.MY_DJ_LIFE_PLATINUM_2ND_YEARLY_PRICING_ID,
};
const myInfluencerLifePricing = {
  BRONZE_MONTHLY: process.env.MY_INFLUENCER_LIFE_BRONZE_MONTHLY_PRICING_ID,
  BRONZE_YEARLY: process.env.MY_INFLUENCER_LIFE_BRONZE_YEARLY_PRICING_ID,
  SILVER_MONTHLY: process.env.MY_INFLUENCER_LIFE_SILVER_MONTHLY_PRICING_ID,
  SILVER_YEARLY: process.env.MY_INFLUENCER_LIFE_SILVER_YEARLY_PRICING_ID,
  GOLD_MONTHLY: process.env.MY_INFLUENCER_LIFE_GOLD_MONTHLY_PRICING_ID,
  GOLD_YEARLY: process.env.MY_INFLUENCER_LIFE_GOLD_YEARLY_PRICING_ID,
  PLATINUM_MONTHLY: process.env.MY_INFLUENCER_LIFE_PLATINUM_MONTHLY_PRICING_ID,
  PLATINUM_YEARLY: process.env.MY_INFLUENCER_LIFE_PLATINUM_YEARLY_PRICING_ID,
};
const myRestrurentLifePricing = {
  BRONZE_MONTHLY: process.env.MY_RESTRURENT_LIFE_BRONZE_MONTHLY_PRICING_ID,
  BRONZE_YEARLY: process.env.MY_RESTRURENT_LIFE_BRONZE_YEARLY_PRICING_ID,
  SILVER_MONTHLY: process.env.MY_RESTRURENT_LIFE_SILVER_MONTHLY_PRICING_ID,
  SILVER_YEARLY: process.env.MY_RESTRURENT_LIFE_SILVER_YEARLY_PRICING_ID,
  GOLD_MONTHLY: process.env.MY_RESTRURENT_LIFE_GOLD_MONTHLY_PRICING_ID,
  GOLD_YEARLY: process.env.MY_RESTRURENT_LIFE_GOLD_YEARLY_PRICING_ID,
  PLATINUM_MONTHLY: process.env.MY_RESTRURENT_LIFE_PLATINUM_MONTHLY_PRICING_ID,
  PLATINUM_YEARLY: process.env.MY_RESTRURENT_LIFE_PLATINUM_YEARLY_PRICING_ID,
};
const myStudentLifePricing = {
  BRONZE_MONTHLY: process.env.MY_STUDENT_LIFE_BRONZE_MONTHLY_PRICING_ID,
  BRONZE_YEARLY: process.env.MY_STUDENT_LIFE_BRONZE_YEARLY_PRICING_ID,
  SILVER_MONTHLY: process.env.MY_STUDENT_LIFE_SILVER_MONTHLY_PRICING_ID,
  SILVER_YEARLY: process.env.MY_STUDENT_LIFE_SILVER_YEARLY_PRICING_ID,
  GOLD_MONTHLY: process.env.MY_STUDENT_LIFE_GOLD_MONTHLY_PRICING_ID,
  GOLD_YEARLY: process.env.MY_STUDENT_LIFE_GOLD_YEARLY_PRICING_ID,
  PLATINUM_MONTHLY: process.env.MY_STUDENT_LIFE_PLATINUM_MONTHLY_PRICING_ID,
  PLATINUM_YEARLY: process.env.MY_STUDENT_LIFE_PLATINUM_YEARLY_PRICING_ID,
};

// create my dj life payment
async function createMyDjLifePayment(
  plan,
  price,
  duration,
  oldPrice,
  planId,
  userId
) {
  const successUrl = `${baseURL}/onboards/success`;
  const failedUrl = `${baseURL}/onboards`;
  try {
    const existSeller = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        membership: true,
      },
    });

    const { username, email } = existSeller || {};
    const priceId = myDjLifePricing[plan];
    if (!priceId) {
      return { pageUrl: "", message: INVALID_PLAN_MESSAGE };
    }
    const existingCustomer = await stripe.customers.list({ email });
    let customer;
    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      customer = await stripe.customers.create({ email, name: username });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customer.id,
      billing_address_collection: "required",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: failedUrl,
      metadata: { userId: userId, planId: planId },
      automatic_tax: { enabled: true },
      customer_update: {
        address: "auto",
      },
    });
    if (existSeller?.membership?.length === 0) {
      await Prisma.userMembership.create({
        data: {
          plan: plan,
          price: price,
          duration: duration,
          expired: false,
          status: "PENDING",
          activate_at: "",
          oldPrice: oldPrice,
          transactionId: session.id,
          userId: userId,
        },
      });
    } else {
      await Prisma.userMembership.updateMany({
        where: {
          userId: userId,
        },
        data: {
          plan: plan,
          price: price,
          duration: duration,
          expired: false,
          status: "PENDING",
          activate_at: "",
          oldPrice: oldPrice,
          transactionId: session.id,
          userId: userId,
        },
      });
    }
    return { pageUrl: session.url, message: QUERY_SUCCESSFUL_MESSAGE };
  } catch (error) {
    return { status: ERROR_STATUS, message: error.message };
  }
}

// create influencer life payment
async function createMyInfluencerLifePayment(
  plan,
  price,
  duration,
  oldPrice,
  planId,
  userId
) {
  const successUrl = `${baseURL}/payment/success`;
  const failedUrl = `${baseURL}/onboards`;
  try {
    const existSeller = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        membership: true,
      },
    });

    const { username, email } = existSeller || {};
    const priceId = myInfluencerLifePricing[plan];

    if (!priceId) {
      return { pageUrl: "", message: INVALID_PLAN_MESSAGE };
    }
    const existingCustomer = await stripe.customers.list({ email });
    let customer;
    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      customer = await stripe.customers.create({ email, name: username });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customer.id,
      billing_address_collection: "required",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: failedUrl,
      metadata: { userId: userId, planId: planId },
      automatic_tax: { enabled: true },
      customer_update: {
        address: "auto",
      },
    });

    if (existSeller?.membership?.length === 0) {
      await Prisma.userMembership.create({
        data: {
          plan: plan,
          price: price,
          duration: duration,
          expired: false,
          status: "PENDING",
          activate_at: "",
          oldPrice: oldPrice,
          transactionId: session.id,
          userId: userId,
        },
      });
    } else {
      await Prisma.userMembership.updateMany({
        where: {
          userId: userId,
        },
        data: {
          plan: plan,
          price: price,
          duration: duration,
          expired: false,
          status: "PENDING",
          activate_at: "",
          oldPrice: oldPrice,
          transactionId: session.id,
          userId: userId,
        },
      });
    }
    return { pageUrl: session.url, message: QUERY_SUCCESSFUL_MESSAGE };
  } catch (error) {
    return { status: ERROR_STATUS, message: error.message };
  }
}

// create restrurent life payment
async function createMyRestrurentLifePayment(
  plan,
  price,
  duration,
  oldPrice,
  planId,
  userId
) {
  const successUrl = `${baseURL}/payment/success`;
  const failedUrl = `${baseURL}/onboards`;
  try {
    const existSeller = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        membership: true,
      },
    });

    const { username, email } = existSeller || {};
    const priceId = myRestrurentLifePricing[plan];

    if (!priceId) {
      return { pageUrl: "", message: INVALID_PLAN_MESSAGE };
    }
    const existingCustomer = await stripe.customers.list({ email });
    let customer;
    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      customer = await stripe.customers.create({ email, name: username });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customer.id,
      billing_address_collection: "required",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: failedUrl,
      metadata: { userId: userId, planId: planId },
      automatic_tax: { enabled: true },
      customer_update: {
        address: "auto",
      },
    });

    if (existSeller?.membership?.length === 0) {
      await Prisma.userMembership.create({
        data: {
          plan: plan,
          price: price,
          duration: duration,
          expired: false,
          status: "PENDING",
          activate_at: "",
          oldPrice: oldPrice,
          transactionId: session.id,
          userId: userId,
        },
      });
    } else {
      await Prisma.userMembership.updateMany({
        where: {
          userId: userId,
        },
        data: {
          plan: plan,
          price: price,
          duration: duration,
          expired: false,
          status: "PENDING",
          activate_at: "",
          oldPrice: oldPrice,
          transactionId: session.id,
          userId: userId,
        },
      });
    }
    return { pageUrl: session.url, message: QUERY_SUCCESSFUL_MESSAGE };
  } catch (error) {
    return { status: ERROR_STATUS, message: error.message };
  }
}

// create student life payment
async function createMyStudentLifePayment(
  plan,
  price,
  duration,
  oldPrice,
  planId,
  userId
) {
  const successUrl = `${baseURL}/payment/success`;
  const failedUrl = `${baseURL}/business/plans`;
  try {
    const existSeller = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        membership: true,
      },
    });

    const { username, email } = existSeller || {};
    const priceId = myStudentLifePricing[plan];

    if (!priceId) {
      return { pageUrl: "", message: INVALID_PLAN_MESSAGE };
    }
    const existingCustomer = await stripe.customers.list({ email });
    let customer;
    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      customer = await stripe.customers.create({ email, name: username });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customer.id,
      billing_address_collection: "required",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: failedUrl,
      metadata: { userId: userId, planId: planId },
      automatic_tax: { enabled: true },
      customer_update: {
        address: "auto",
      },
    });

    if (existSeller?.membership?.length === 0) {
      await Prisma.userMembership.create({
        data: {
          plan: plan,
          price: price,
          duration: duration,
          expired: false,
          status: "PENDING",
          activate_at: "",
          oldPrice: oldPrice,
          transactionId: session.id,
          userId: userId,
        },
      });
    } else {
      await Prisma.userMembership.updateMany({
        where: {
          userId: userId,
        },
        data: {
          plan: plan,
          price: price,
          duration: duration,
          expired: false,
          status: "PENDING",
          activate_at: "",
          oldPrice: oldPrice,
          transactionId: session.id,
          userId: userId,
        },
      });
    }
    return { pageUrl: session.url, message: QUERY_SUCCESSFUL_MESSAGE };
  } catch (error) {
    return { status: ERROR_STATUS, message: error.message };
  }
}

module.exports = {
  createMyDjLifePayment,
  createMyInfluencerLifePayment,
  createMyRestrurentLifePayment,
  createMyStudentLifePayment,
};
