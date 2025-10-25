import { Router } from "express";
import Logo from "../models/Logo.js";
import { uploadToImgBB } from "../imgbb.js";

const router = Router();

/**
 * Body: { imageBase64 }
 */
router.post("/", async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ message: "imageBase64 required" });

        const uploaded = await uploadToImgBB(imageBase64, "site_logo");
        const doc = await Logo.create({ imageUrl: uploaded?.url || uploaded?.display_url });

        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/latest", async (_req, res) => {
    try {
        const doc = await Logo.findOne().sort({ createdAt: -1 });
        res.json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
