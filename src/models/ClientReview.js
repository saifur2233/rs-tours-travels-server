import mongoose from "mongoose";

const clientReviewSchema = new mongoose.Schema(
    {
        review_message: {
            type: String,
            required: true,
        },
        given_star: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        reviewer_name: {
            type: String,
            required: true,
        },
        reviewer_profession: {
            type: String,
            required: true,
        },
        reviewer_image: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const ClientReview = mongoose.model("ClientReview", clientReviewSchema);
export default ClientReview;
