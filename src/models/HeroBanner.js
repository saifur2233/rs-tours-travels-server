import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema(
    {
        imageUrl: { type: String, required: true },
        topSubtitle: { type: String, default: "" },
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        btnLabel: { type: String, default: "" },
        btnHref: { type: String, default: "#" }
    },
    { timestamps: true, collection: "hero_banner" }
);

export default mongoose.model("HeroBanner", heroBannerSchema);
