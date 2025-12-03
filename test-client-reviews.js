import { connectDB } from "./src/db.js";
import ClientReview from "./src/models/ClientReview.js";

const sampleReviews = [
    {
        review_message: "Excellent service! RS Tours made my visa process incredibly smooth and hassle-free. Their team was professional, responsive, and guided me through every step. Highly recommended for anyone seeking reliable travel and visa services.",
        given_star: 5,
        reviewer_name: "Ahmed Rahman",
        reviewer_profession: "Business Owner",
        reviewer_image: "https://i.ibb.co/ZMxQjDX/testimonial-1.jpg"
    },
    {
        review_message: "Outstanding experience with RS Tours for my Hajj package. The arrangements were perfect, accommodations were comfortable, and the guidance throughout the journey was exceptional. Thank you for making this spiritual journey memorable!",
        given_star: 5,
        reviewer_name: "Fatima Khan",
        reviewer_profession: "Teacher",
        reviewer_image: "https://i.ibb.co/kXWRPGb/testimonial-2.jpg"
    },
    {
        review_message: "Very professional and efficient ticketing service. Got the best rates for my international flight and the booking process was seamless. Customer support was available 24/7 to answer all my queries. Will definitely use their services again!",
        given_star: 4,
        reviewer_name: "Karim Hossain",
        reviewer_profession: "Software Engineer",
        reviewer_image: "https://i.ibb.co/HBnC2hK/testimonial-3.jpg"
    }
];

async function seedClientReviews() {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        // Clear existing reviews
        await ClientReview.deleteMany({});
        console.log("Cleared existing reviews");

        // Insert sample reviews
        const reviews = await ClientReview.insertMany(sampleReviews);
        console.log(`Successfully added ${reviews.length} client reviews`);

        reviews.forEach((review, index) => {
            console.log(`\n${index + 1}. ${review.reviewer_name} - ${review.given_star} stars`);
            console.log(`   ${review.review_message.substring(0, 60)}...`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error seeding client reviews:", error);
        process.exit(1);
    }
}

seedClientReviews();
