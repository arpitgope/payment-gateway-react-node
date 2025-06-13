import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [amount, setAmount] = useState("");

  // Load Razorpay SDK
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    const amt = parseInt(amount);

    if (isNaN(amt) || amt < 1 || amt > 50) {
      alert("Please enter a valid amount between ₹1 and ₹50");
      return;
    }

    try {
      const orderResponse = await axios.post("http://localhost:5000/create-order", {
        amount: amt
      });

      const { id, amount: orderAmount, currency } = orderResponse.data.order;

      const options = {
        key: "rzp_test_55QBGovmRtHYk7", // Replace with your real key_id
        amount: orderAmount,
        currency: currency,
        name: "Friendly Pay",
        description: "Just a friendly ₹1-₹50 support",
        image: "https://cdn-icons-png.flaticon.com/512/1048/1048919.png", // fun icon
        order_id: id,
        handler: async function (response) {
          try {
            const verification = await axios.post("http://localhost:5000/verify", response);
            alert("✅ Payment Success! Thank you 🎉");
          } catch (error) {
            alert("❌ Verification Failed");
          }
        },
        prefill: {
          name: "Your Friend",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#4CAF50"
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Oops! Something went wrong. Payment Failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💸 Send ₹1–₹50 to a Friend</h2>
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
        min={1}
        max={50}
      />
      <button onClick={handlePayment} style={styles.button}>
        🚀 Send Now
      </button>
      <p style={styles.note}>Just a small gesture. UPI powered by Razorpay ✨</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "50px auto",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#fefefe"
  },
  heading: {
    marginBottom: 20,
    color: "#4CAF50"
  },
  input: {
    width: "80%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 20,
    fontSize: 16
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  },
  note: {
    marginTop: 20,
    fontSize: 13,
    color: "#777"
  }
};

export default App;
