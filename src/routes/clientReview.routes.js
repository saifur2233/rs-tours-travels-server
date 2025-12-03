import express from "express";
import ClientReview from "../models/ClientReview.js";
import axios from "axios";

const router = express.Router();

// Helper function to upload image to ImgBB
async function uploadToImgBB(base64Image) {
    try {
        const formData = new FormData();
        formData.append("image", base64Image.split(",")[1]);

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.data.url;
    } catch (error) {
        throw new Error("Image upload failed");
    }
}

// Get all client reviews
router.get("/", async (req, res) => {
    try {
        const reviews = await ClientReview.find().sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single client review by ID
router.get("/:id", async (req, res) => {
    try {
        const review = await ClientReview.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create new client review
router.post("/", async (req, res) => {
    try {
        const { review_message, given_star, reviewer_name, reviewer_profession, reviewer_image } = req.body;

        // Validate required fields
        if (!review_message || !given_star || !reviewer_name || !reviewer_profession || !reviewer_image) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Upload reviewer image to ImgBB
        const imageUrl = await uploadToImgBB(reviewer_image);

        // Create new review
        const newReview = new ClientReview({
            review_message,
            given_star,
            reviewer_name,
            reviewer_profession,
            reviewer_image: imageUrl,
        });

        await newReview.save();
        res.status(201).json({ success: true, data: newReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update client review
router.put("/:id", async (req, res) => {
    try {
        const { review_message, given_star, reviewer_name, reviewer_profession, reviewer_image } = req.body;

        const review = await ClientReview.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Update fields
        if (review_message) review.review_message = review_message;
        if (given_star) review.given_star = given_star;
        if (reviewer_name) review.reviewer_name = reviewer_name;
        if (reviewer_profession) review.reviewer_profession = reviewer_profession;

        // If new image is provided, upload it
        if (reviewer_image && reviewer_image.startsWith("data:")) {
            const imageUrl = await uploadToImgBB(reviewer_image);
            review.reviewer_image = imageUrl;
        }

        await review.save();
        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete client review
router.delete("/:id", async (req, res) => {
    try {
        const review = await ClientReview.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
