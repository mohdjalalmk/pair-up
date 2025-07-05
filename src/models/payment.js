const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String},

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    amount: { type: Number },
    currency: { type: String, default: 'INR' },
    status: { type: String, default: 'created' }, 
    receipt: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
