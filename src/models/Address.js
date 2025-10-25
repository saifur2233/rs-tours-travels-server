import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
    { text: { type: String, required: true } },
    { timestamps: true, collection: "address" }
);
export default mongoose.model("Address", addressSchema);
