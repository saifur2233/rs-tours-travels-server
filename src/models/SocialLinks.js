import mongoose from "mongoose";
const socialLinksSchema = new mongoose.Schema(
    {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" },
        linkedin: { type: String, default: "" }
    },
    { timestamps: true, collection: "social_links" }
);
export default mongoose.model("SocialLinks", socialLinksSchema);
