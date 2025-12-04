import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const router = Router();

// Generate JWT
const genToken = (admin) =>
    jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "5h",
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
        if (!admin) return res.status(404).json({ message: "Email and Password Not Match" });

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

// GET PROFILE
router.get("/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) return res.status(404).json({ message: "Email and Password Not Match" });
        res.json({
            success: true,
            data: {
                name: admin.username,
                email: admin.email
            }
        });
    } catch (err) {
        res.status(401).json({ success: false, message: "Not authorized" });
    }
});

// UPDATE PROFILE
router.put("/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { name, email } = req.body;

        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(404).json({ message: "Email and Password Not Match" });

        // Update fields
        if (name) admin.username = name;
        if (email) admin.email = email;

        await admin.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                name: admin.username,
                email: admin.email
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CHANGE PASSWORD
router.put("/change-password", async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password required" });
        }

        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(404).json({ message: "Email and Password Not Match" });

        // Verify current password
        const valid = await admin.matchPassword(currentPassword);
        if (!valid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET ALL ADMINS
router.get("/admins", async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admins = await Admin.find().select("-password").sort({ createdAt: -1 });
        res.json({
            success: true,
            data: admins.map(admin => ({
                id: admin._id,
                name: admin.username,
                email: admin.email,
                createdAt: admin.createdAt
            }))
        });
    } catch (err) {
        res.status(401).json({ success: false, message: "Not authorized" });
    }
});

// CREATE ADMIN
router.post("/admins", async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: "All fields required" });

        const exists = await Admin.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        const admin = await Admin.create({ username, email, password });
        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                id: admin._id,
                name: admin.username,
                email: admin.email
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// UPDATE ADMIN
router.put("/admins/:id", async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { username, email } = req.body;

        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        // Check if email already exists for another admin
        if (email && email !== admin.email) {
            const emailExists = await Admin.findOne({ email });
            if (emailExists) return res.status(400).json({ message: "Email already exists" });
        }

        if (username) admin.username = username;
        if (email) admin.email = email;

        await admin.save();

        res.json({
            success: true,
            message: "Admin updated successfully",
            data: {
                id: admin._id,
                name: admin.username,
                email: admin.email
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE ADMIN
router.delete("/admins/:id", async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Prevent self-deletion
        if (decoded.id === req.params.id) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }

        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        res.json({
            success: true,
            message: "Admin deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
