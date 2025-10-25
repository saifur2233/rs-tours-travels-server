import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const router = Router();

// Generate JWT
const genToken = (admin) =>
    jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "1d",
    });

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: "All fields required" });

        const exists = await Admin.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already used" });

        const admin = await Admin.create({ username, email, password });
        res.status(201).json({ success: true, message: "Admin registered" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const valid = await admin.matchPassword(password);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });

        const token = genToken(admin);
        res.json({
            success: true,
            token,
            admin: { id: admin._id, username: admin.username, email: admin.email },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// VERIFY (optional)
router.get("/verify", async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) return res.status(401).json({ message: "Invalid token" });
        res.json({ success: true, admin });
    } catch {
        res.status(401).json({ success: false, message: "Not authorized" });
    }
});

export default router;
