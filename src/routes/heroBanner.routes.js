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

// Get all banners
router.get("/", async (_req, res) => {
    try {
        const docs = await HeroBanner.find().sort({ createdAt: -1 });
        res.json({ success: true, data: docs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update a banner by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { imageBase64, topSubtitle, title, subtitle, btnLabel, btnHref } = req.body;

        const updateData = {};

        if (imageBase64) {
            const uploaded = await uploadToImgBB(imageBase64, "hero_banner");
            updateData.imageUrl = uploaded?.url || uploaded?.display_url;
        }

        if (topSubtitle !== undefined) updateData.topSubtitle = topSubtitle;
        if (title !== undefined) updateData.title = title;
        if (subtitle !== undefined) updateData.subtitle = subtitle;
        if (btnLabel !== undefined) updateData.btnLabel = btnLabel;
        if (btnHref !== undefined) updateData.btnHref = btnHref;

        const doc = await HeroBanner.findByIdAndUpdate(id, updateData, { new: true });

        if (!doc) {
            return res.status(404).json({ success: false, message: "Hero banner not found" });
        }

        res.json({ success: true, data: doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete a banner by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await HeroBanner.findByIdAndDelete(id);

        if (!doc) {
            return res.status(404).json({ success: false, message: "Hero banner not found" });
        }

        res.json({ success: true, message: "Hero banner deleted successfully", data: doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
