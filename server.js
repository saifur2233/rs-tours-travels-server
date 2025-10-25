import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/db.js";

import heroBannerRoutes from "./src/routes/heroBanner.routes.js";
import hotlineRoutes from "./src/routes/hotline.routes.js";
import logoRoutes from "./src/routes/logo.routes.js";
import emailRoutes from "./src/routes/email.routes.js";
import addressRoutes from "./src/routes/address.routes.js";
import socialRoutes from "./src/routes/social.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(cors());                 // Allow frontend (5173) to call API
app.use(express.json({ limit: "20mb" })); // allow base64 images
app.use("/api/auth", authRoutes);

// Health
app.get("/", (req, res) => res.json({ ok: true, service: "rs-tours-api" }));

// Routes
app.use("/api/hero-banner", heroBannerRoutes);
app.use("/api/hotline", hotlineRoutes);
app.use("/api/logo", logoRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/social-links", socialRoutes);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
