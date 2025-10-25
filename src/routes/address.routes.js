import { Router } from "express";
import Address from "../models/Address.js";
const router = Router();

/** Body: { text } */
router.post("/", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "text required" });

        const doc = await Address.create({ text });
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/latest", async (_req, res) => {
    try {
        const doc = await Address.findOne().sort({ createdAt: -1 });
        res.json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
