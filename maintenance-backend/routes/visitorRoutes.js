const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");
const User = require("../models/User"); // Import user to get block number

// ➕ Add a visitor
router.post("/add", async (req, res) => {
  try {
    const { username, visitorName, dateIn, dateOut, timeIn, timeOut } = req.body;

    // 1. Validate
    if (!username || !visitorName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Find user to get block number
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const blockNumber = user.block;

    // 3. Save visitor
    const newVisitor = new Visitor({
      visitorName,
      dateIn,
      dateOut,
      timeIn,
      timeOut,
      blockNumber,
      residentUsername: username
    });

    await newVisitor.save();
    res.status(201).json({ message: "Visitor added successfully" });
  } catch (error) {
    console.error("❌ Error saving visitor:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 📤 Get all visitors (admin view)
router.get("/", async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ dateIn: -1 });
    res.json(visitors);
  } catch (error) {
    console.error("❌ Error fetching visitors:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 📤 Get only logged-in resident's visitors (optional)
router.get("/resident/:username", async (req, res) => {
  try {
    const visitors = await Visitor.find({ residentUsername: req.params.username });
    res.json(visitors);
  } catch (error) {
    console.error("❌ Error fetching visitor records:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
