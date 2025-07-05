const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// ✅ POST: Registration
router.post('/register', async (req, res) => {
    try {
        const {
            username, password, role,
            email, phone, age, block,
            numPersons, memberNames,
            address, city, state, pincode
        } = req.body;

        // Validate essential fields
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Username, password, and role are required.' });
        }

        // Check for duplicate user
        const existingUser = await User.findOne({ username, role });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this role.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            email, phone, age, block,
            numPersons, memberNames,
            address, city, state, pincode
        });

        // Save user to DB
        await newUser.save();
        res.status(201).json({ message: '✅ Registration successful!', user: newUser });

    } catch (err) {
        console.error('❌ Registration error:', err.message);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ✅ POST: Login
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ username, role });
        if (!user) {
            return res.status(404).json({ error: "User not found for the selected role" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        res.status(200).json({ message: "✅ Login successful", user });

    } catch (err) {
        console.error("❌ Login error:", err.message);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ✅ GET: All resident users (for Resident Account page)
router.get('/residents', async (req, res) => {
    try {
        const residents = await User.find({ role: 'resident' });
        res.status(200).json(residents);
    } catch (err) {
        console.error("❌ Error fetching residents:", err.message);
        res.status(500).json({ error: 'Failed to fetch residents' });
    }
});

module.exports = router;
