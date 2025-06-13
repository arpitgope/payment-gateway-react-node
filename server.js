const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
app.post("/create-order", async (req, res) => {
  try {
    const amount = req.body.amount * 100; // Razorpay takes amount in paise

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({ order }); //  frontend expects order key
  } catch (err) {
    console.error("Error creating Razorpay order", err);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// Verify Payment (Optional, if needed)
app.post("/verify", (req, res) => {
  try {
    // You can add your signature verification logic here if needed
    res.status(200).json({ status: "Payment Verified Successfully" });
  } catch (err) {
    res.status(400).json({ status: "Verification Failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
