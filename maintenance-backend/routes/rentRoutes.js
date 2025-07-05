const express = require("express");
const router = express.Router();
const Rent = require("../models/rent");

// Utility: get start & end of month for duplicate check
function getMonthRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

// ✅ 1. Add a new rent payment (resident or admin)
router.post("/add", async (req, res) => {
  try {
    const { residentId, residentName, phone, block, amount, paymentDate, status } = req.body;

    if (!residentName || !phone || !block || !amount || !paymentDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payDate = new Date(paymentDate);
    const { start, end } = getMonthRange(payDate);

    // ❌ If residentId exists, check duplicate only for that user & month
    if (residentId) {
      const alreadyPaid = await Rent.findOne({
        residentId,
        paymentDate: { $gte: start, $lte: end }
      });

      if (alreadyPaid) {
        return res.status(409).json({ error: "Rent already paid for this month." });
      }
    }

    // ✅ Save payment
    const newPayment = new Rent({
      residentId: residentId || null,
      residentName: residentName.trim(),
      phone,
      block: block.trim().toUpperCase(),
      amount,
      paymentDate: payDate,
      status: status || "Due"
    });

    await newPayment.save();
    res.status(201).json({ message: "Payment added successfully" });

  } catch (error) {
    console.error("❌ Error adding payment:", error);
    res.status(500).json({ error: "Error adding payment" });
  }
});

// ✅ 2. Get all rent payments (admin view)
router.get("/", async (req, res) => {
  try {
    const payments = await Rent.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching payments" });
  }
});

// ✅ 3. Get payments for a specific resident
router.get("/user/:residentId", async (req, res) => {
  try {
    const payments = await Rent.find({ residentId: req.params.residentId }).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user payments" });
  }
});

// ✅ 4. Mark a payment as Paid
router.put("/mark-paid/:id", async (req, res) => {
  try {
    await Rent.findByIdAndUpdate(req.params.id, { status: "Paid" });
    res.json({ message: "Payment marked as Paid" });
  } catch (error) {
    res.status(500).json({ error: "Error updating payment status" });
  }
});

// ✅ 5. Delete a payment
router.delete("/delete/:id", async (req, res) => {
  try {
    await Rent.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting payment" });
  }
});

module.exports = router;
