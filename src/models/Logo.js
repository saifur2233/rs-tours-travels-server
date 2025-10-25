import mongoose from "mongoose";
const logoSchema = new mongoose.Schema(
    { imageUrl: { type: String, required: true } },
    { timestamps: true, collection: "logo" }
);
export default mongoose.model("Logo", logoSchema);
