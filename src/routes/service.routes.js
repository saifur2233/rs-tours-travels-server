import { Router } from "express";
import Service from "../models/Service.js";
import { uploadToImgBB } from "../imgbb.js";

const router = Router();

/**
 * Create a new service
 * Body: {
 *   service_img_base64: "data:image/png;base64,...",  // required
 *   service_extra_img_base64: "...",  // optional
 *   service_name, service_short_desc, service_desc
 * }
 */
router.post("/", async (req, res) => {
    try {
        const { service_img_base64, service_extra_img_base64, service_name, service_short_desc, service_desc } = req.body;

        if (!service_img_base64) return res.status(400).json({ message: "service_img_base64 required" });
        if (!service_name) return res.status(400).json({ message: "service_name required" });
        if (!service_short_desc) return res.status(400).json({ message: "service_short_desc required" });
        if (!service_desc) return res.status(400).json({ message: "service_desc required" });

        const uploadedImg = await uploadToImgBB(service_img_base64, "service");

        let service_extra_img = "";
        if (service_extra_img_base64) {
            const uploadedExtraImg = await uploadToImgBB(service_extra_img_base64, "service_extra");
            service_extra_img = uploadedExtraImg?.url || uploadedExtraImg?.display_url;
        }

        const doc = await Service.create({
            service_img: uploadedImg?.url || uploadedImg?.display_url,
            service_extra_img,
            service_name,
            service_short_desc,
            service_desc
        });

        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all services
router.get("/", async (_req, res) => {
    try {
        const docs = await Service.find().sort({ createdAt: -1 });
        res.json({ success: true, data: docs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get service by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Service.findById(id);

        if (!doc) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update a service by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { service_img_base64, service_extra_img_base64, service_name, service_short_desc, service_desc } = req.body;

        const updateData = {};

        if (service_img_base64) {
            const uploadedImg = await uploadToImgBB(service_img_base64, "service");
            updateData.service_img = uploadedImg?.url || uploadedImg?.display_url;
        }

        if (service_extra_img_base64) {
            const uploadedExtraImg = await uploadToImgBB(service_extra_img_base64, "service_extra");
            updateData.service_extra_img = uploadedExtraImg?.url || uploadedExtraImg?.display_url;
        }

        if (service_name !== undefined) updateData.service_name = service_name;
        if (service_short_desc !== undefined) updateData.service_short_desc = service_short_desc;
        if (service_desc !== undefined) updateData.service_desc = service_desc;

        const doc = await Service.findByIdAndUpdate(id, updateData, { new: true });

        if (!doc) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({ success: true, data: doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete a service by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Service.findByIdAndDelete(id);

        if (!doc) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({ success: true, message: "Service deleted successfully", data: doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
