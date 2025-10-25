import mongoose from "mongoose";
const emailSchema = new mongoose.Schema(
    { email: { type: String, required: true } },
    { timestamps: true, collection: "email_address" }
);
export default mongoose.model("EmailAddress", emailSchema);
