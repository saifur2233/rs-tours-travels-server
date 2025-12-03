import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        service_img: { type: String, required: true },
        service_extra_img: { type: String, default: "" },
        service_name: { type: String, required: true },
        service_short_desc: { type: String, required: true },
        service_desc: { type: String, required: true }
    },
    { timestamps: true, collection: "services" }
);

export default mongoose.model("Service", serviceSchema);
