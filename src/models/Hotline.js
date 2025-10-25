import mongoose from "mongoose";
const hotlineSchema = new mongoose.Schema(
    { number: { type: String, required: true } },
    { timestamps: true, collection: "hotline" }
);
export default mongoose.model("Hotline", hotlineSchema);
