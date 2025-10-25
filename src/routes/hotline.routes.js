import { Router } from "express";
import Hotline from "../models/Hotline.js";
const router = Router();

/** Body: { number } */
router.post("/", async (req, res) => {
    try {
        const { number } = req.body;
        if (!number) return res.status(400).json({ message: "number required" });

        const doc = await Hotline.create({ number });
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/latest", async (_req, res) => {
    try {
        const doc = await Hotline.findOne().sort({ createdAt: -1 });
        res.json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
