import { Router } from "express";
import EmailAddress from "../models/EmailAddress.js";
const router = Router();

/** Body: { email } */
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "email required" });

        const doc = await EmailAddress.create({ email });
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/latest", async (_req, res) => {
    try {
        const doc = await EmailAddress.findOne().sort({ createdAt: -1 });
        res.json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
