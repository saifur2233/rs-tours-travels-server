import { Router } from "express";
import SocialLinks from "../models/SocialLinks.js";
const router = Router();

/** Body: { facebook?, twitter?, instagram?, linkedin? } */
router.post("/", async (req, res) => {
    try {
        const { facebook = "", twitter = "", instagram = "", linkedin = "" } = req.body;
        const doc = await SocialLinks.create({ facebook, twitter, instagram, linkedin });
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/latest", async (_req, res) => {
    try {
        const doc = await SocialLinks.findOne().sort({ createdAt: -1 });
        res.json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
