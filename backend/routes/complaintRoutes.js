const express = require("express");
const crypto = require("crypto");
const Complaint = require("../models/Complaint");
const upload = require("../middleware/upload");

const router = express.Router();

const allowedCategories = [
    "Pothole",
    "Garbage",
    "Open sewer / drainage",
    "Streetlight",
    "Water supply",
    "Road damage",
    "Public sanitation",
    "Other"
];

const allowedSeverities = ["Low", "Medium", "High", "Critical"];

function createIssueCode() {
    const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `NS-${new Date().getFullYear()}-${suffix}`;
}

function removeUploadedPhoto(req) {
    if (!req.file) return;
    const fs = require("fs");
    const path = require("path");
    fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => {});
}

// Submit one complaint. Photo is optional; text fields arrive through FormData.
router.post("/", upload.single("photo"), async (req, res, next) => {
    try {
        const category = String(req.body.category || "").trim();
        const title = String(req.body.title || "").trim();
        const location = String(req.body.location || "").trim();
        const description = String(req.body.description || "").trim();
        const severity = String(req.body.severity || "Medium").trim();

        if (!allowedCategories.includes(category)) {
            removeUploadedPhoto(req);
            return res.status(400).json({ success: false, message: "Please select a valid issue category." });
        }
        if (!title || title.length > 120) {
            removeUploadedPhoto(req);
            return res.status(400).json({ success: false, message: "Enter an issue title (maximum 120 characters)." });
        }
        if (!location || location.length > 250) {
            removeUploadedPhoto(req);
            return res.status(400).json({ success: false, message: "Enter a location (maximum 250 characters)." });
        }
        if (!description || description.length > 3000) {
            removeUploadedPhoto(req);
            return res.status(400).json({ success: false, message: "Enter a description (maximum 3000 characters)." });
        }
        if (!allowedSeverities.includes(severity)) {
            removeUploadedPhoto(req);
            return res.status(400).json({ success: false, message: "Please select a valid severity." });
        }

        let issueCode = createIssueCode();
        while (await Complaint.exists({ issueCode })) {
            issueCode = createIssueCode();
        }

        const photo = req.file ? {
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`,
            mimeType: req.file.mimetype,
            size: req.file.size
        } : undefined;

        const complaint = await Complaint.create({
            id: Date.now(),
            issueCode,
            category,
            title,
            location,
            description,
            severity,
            photoName: req.file ? req.file.filename : "",
            photo,
            status: "Reported",
            date: new Date()
        });

        return res.status(201).json({
            success: true,
            message: "Complaint saved successfully!",
            complaint
        });
    } catch (error) {
        removeUploadedPhoto(req);
        next(error);
    }
});

// Return recent complaints for dashboards and locality pages.
router.get("/", async (req, res, next) => {
    try {
        const complaints = await Complaint.find().sort({ date: -1 }).limit(200).lean();
        res.json({ success: true, count: complaints.length, complaints });
    } catch (error) {
        next(error);
    }
});

// Look up a complaint by its public tracking code or legacy numeric ID.
router.get("/:reference", async (req, res, next) => {
    try {
        const reference = String(req.params.reference).trim();
        const query = /^\d+$/.test(reference)
            ? { id: Number(reference) }
            : { issueCode: reference.toUpperCase() };

        const complaint = await Complaint.findOne(query).lean();
        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        res.json({ success: true, complaint });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
