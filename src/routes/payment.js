const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const { userAuth } = require("../middlewares/auth");
const { razorpay } = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user"); 
const { PREMIUM_AMOUNT } = require("../constants/constants");

router.post("/payment/create-order", userAuth, async (req, res) => {
  const user = req.user;
  const { currency = "INR", receipt = "receipt#1" } = req.body;

  try {
    const options = {
      amount: PREMIUM_AMOUNT * 100,
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      razorpay_order_id: order.id,
      amount: options.amount,
      currency,
      status: order.status,
      userId: user._id,
    });

    const savedPayment = await payment.save();

    return res.status(200).json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZOR_PAY_KEY_ID,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return res.status(500).json({ error: "Failed to create order" });
  }
});


// Webhook Route
router.post(
  "/payment/webhook",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
  async (req, res) => {
    const secret = process.env.RAZOR_PAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = req.body;

    if (event.event === "payment.captured") {
      try {
        const { order_id, id: payment_id } = event.payload.payment.entity;

        const payment = await Payment.findOneAndUpdate(
          { razorpay_order_id: order_id },
          {
            status: "captured",
            razorpay_payment_id: payment_id,
          },
          { new: true }
        );

        if (payment?.userId) {
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 6);

          await User.findByIdAndUpdate(payment.userId, {
            isPremium: true,
            premiumExpiry: expiryDate,
          });
        }
      } catch (err) {
        console.error("Error handling payment capture:", err);
      }
    }

    if (event.event === "payment.failed") {
      try {
        const paymentEntity = event.payload.payment.entity;

        await Payment.findOneAndUpdate(
          { razorpay_order_id: paymentEntity.order_id },
          {
            status: "failed",
            razorpay_payment_id: paymentEntity.id,
            reason: paymentEntity.error_description || "Unknown reason",
          }
        );

        console.warn(`Payment failed: ${paymentEntity.error_description}`);
      } catch (err) {
        console.error("Error handling payment failure:", err);
      }
    }

    // Always respond with 200 to Razorpay
    return res.status(200).json({ status: "ok" });
  }
);

module.exports = router;
