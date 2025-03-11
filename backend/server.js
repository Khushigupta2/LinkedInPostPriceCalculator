require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://me:8WNEgqjjwkeVrGn5@cluster0.5kiue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors({ origin: "*" })); // Customize allowed origins if needed
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Schema and Model
const priceSchema = new mongoose.Schema({
    followerCount: { type: Number, required: true },
    engagementRate: { type: Number, required: true },
    industry: { type: String, required: true },
    contentType: { type: String, required: true },
    audienceType: { type: String, required: true },
    geography: { type: String, required: true },
    influencerAuthority: { type: String, required: true },
    brandAffinity: { type: Number, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const PriceModel = mongoose.model("Price", priceSchema);

// Price Calculation Route
app.post("/calculate", async (req, res) => {
    try {
        const {
            followerCount,
            engagementRate,
            industry,
            contentType,
            audienceType,
            geography,
            influencerAuthority,
            brandAffinity
        } = req.body;

        if (!followerCount || !engagementRate || !industry || !contentType || !audienceType || !geography || !influencerAuthority || brandAffinity === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Base Price Calculation
        let basePrice = followerCount * (engagementRate / 100) * 0.5;

        // Multipliers
        const industryMultiplier = { Tech: 1.2, Finance: 1.4, Lifestyle: 1.1, Healthcare: 1.3, Education: 1.0 };
        const contentTypeMultiplier = { Text: 1.0, Image: 1.2, Video: 1.5, Carousel: 1.8 };
        const audienceMultiplier = { B2B: 1.3, B2C: 1.1 };
        const geographyMultiplier = { USA: 1.5, Europe: 1.4, Asia: 1.2, India: 1.0, Australia: 1.3 };
        const influencerMultiplier = { CEO: 2.0, "Industry Expert": 1.5, Enthusiast: 1.1 };

        // Apply multipliers
        basePrice *= industryMultiplier[industry] || 1.0;
        basePrice *= contentTypeMultiplier[contentType] || 1.0;
        basePrice *= audienceMultiplier[audienceType] || 1.0;
        basePrice *= geographyMultiplier[geography] || 1.0;
        basePrice *= influencerMultiplier[influencerAuthority] || 1.0;
        basePrice *= (1 + (brandAffinity - 3) * 0.1); // Adjust for Brand Affinity

        // Ensure minimum price
        const finalPrice = Math.max(basePrice, 10).toFixed(2);

        // Save to database
        const newPriceEntry = new PriceModel({
            followerCount,
            engagementRate,
            industry,
            contentType,
            audienceType,
            geography,
            influencerAuthority,
            brandAffinity,
            price: parseFloat(finalPrice)
        });

        await newPriceEntry.save();

        res.json({ success: true, price: parseFloat(finalPrice) });
    } catch (error) {
        console.error("❌ Error calculating price:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 API is running...");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
