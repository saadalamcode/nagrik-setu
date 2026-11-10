require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const complaintRoutes = require("./routes/complaintRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const WEBSITE_ROOT = path.resolve(__dirname, "..");
const UPLOADS_DIR = path.join(__dirname, "uploads");

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Do not expose backend source files or JSON data through the website static server.
app.use((req, res, next) => {
    if (req.path === "/backend" || req.path.startsWith("/backend/")) {
        return res.sendStatus(404);
    }
    next();
});

// Serve the existing website and uploaded complaint photos.
app.use(express.static(WEBSITE_ROOT));
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/", (req, res) => {
    res.sendFile(path.join(WEBSITE_ROOT, "homepage.html"));
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend is working!",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

app.get("/api/health", (req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({
        success: connected,
        message: connected ? "Nagrik Setu API is running" : "MongoDB is not connected",
        database: connected ? "connected" : "disconnected"
    });
});

app.use("/api/complaints", complaintRoutes);

app.use((err, req, res, next) => {
    if (err && err.name === "MulterError") {
        const message = err.code === "LIMIT_FILE_SIZE"
            ? "Photo must be 10 MB or smaller."
            : err.message;
        return res.status(400).json({ success: false, message });
    }

    if (err && err.message === "Only JPG, PNG and WEBP images are allowed.") {
        return res.status(400).json({ success: false, message: err.message });
    }

    console.error(err);
    res.status(500).json({ success: false, message: "An unexpected server error occurred." });
});

async function startServer() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error("MONGODB_URI is missing. Add it to backend/.env before starting the server.");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully.");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
