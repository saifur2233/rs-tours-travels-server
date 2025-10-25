import { Router } from "express";
import HeroBanner from "../models/HeroBanner.js";
import { uploadToImgBB } from "../imgbb.js";

const router = Router();

/**
 * Create a new hero banner
 * Body: {
 *   imageBase64: "data:image/png;base64,...",  // or raw base64 without data URI
 *   topSubtitle, title, subtitle, btnLabel, btnHref
 * }
 */
router.post("/", async (req, res) => {
    try {
        const { imageBase64, topSubtitle, title, subtitle, btnLabel, btnHref } = req.body;
        if (!imageBase64) return res.status(400).json({ message: "imageBase64 required" });

        const uploaded = await uploadToImgBB(imageBase64, "hero_banner");
        const doc = await HeroBanner.create({
            imageUrl: uploaded?.url || uploaded?.display_url,
            topSubtitle,
            title,
            subtitle,
            btnLabel,
            btnHref: btnHref || "#"
        });

        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get latest banner
router.get("/latest", async (_req, res) => {
    try {
        const doc = await HeroBanner.findOne().sort({ createdAt: -1 });
        res.json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
