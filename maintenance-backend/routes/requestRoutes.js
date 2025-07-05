const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// GET all requests (or filter by resident)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.resident ? { residentName: req.query.resident } : {};
    const requests = await Request.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching requests:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// POST new request with auto-increment requestNumber and debug logs
router.post('/', async (req, res) => {
  try {
    console.log("➡️ Incoming data:", req.body);

    const lastRequest = await Request.findOne().sort({ createdAt: -1 });
    console.log("🧾 Last request:", lastRequest?.requestNumber);

    let nextNumber = 1;
    if (lastRequest && lastRequest.requestNumber) {
      const lastNum = parseInt(lastRequest.requestNumber.replace("REQ", ""));
      if (!isNaN(lastNum)) nextNumber = lastNum + 1;
    }

    // Loop to ensure unique requestNumber
    let requestNumber;
    while (true) {
      requestNumber = `REQ${String(nextNumber).padStart(3, '0')}`;
      const exists = await Request.findOne({ requestNumber });
      if (!exists) break;
      nextNumber++;
    }

    console.log("🔢 Final requestNumber:", requestNumber);

    const newRequest = new Request({
      ...req.body,
      requestNumber
    });

    await newRequest.save();
    console.log("✅ Saved request:", newRequest);
    res.status(201).json(newRequest);
  } catch (err) {
    console.error("❌ Submission error:", err);
    res.status(400).json({ error: err.message });
  }
});


// PATCH mark as resolved
router.patch('/:id/resolve', async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("❌ Error marking resolved:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// DELETE request
router.delete('/:id', async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted' });
  } catch (err) {
    console.error("❌ Error deleting request:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
