require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");

async function importComplaints() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing from backend/.env");
    }

    const jsonPath = path.join(__dirname, "..", "data", "complaints.json");
    if (!fs.existsSync(jsonPath)) {
        console.log("No data/complaints.json found. Nothing to import.");
        return;
    }

    const oldComplaints = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (!Array.isArray(oldComplaints) || oldComplaints.length === 0) {
        console.log("complaints.json is empty. Nothing to import.");
        return;
    }

    let imported = 0;
    for (const oldItem of oldComplaints) {
        const legacyId = Number(oldItem.id);
        if (!Number.isFinite(legacyId)) {
            console.warn("Skipping a complaint without a numeric id:", oldItem);
            continue;
        }

        const photoName = String(oldItem.photoName || "");
        const legacyDocument = {
            id: legacyId,
            issueCode: `NS-LEGACY-${legacyId}`,
            category: oldItem.category || "Other",
            title: oldItem.title || `${oldItem.category || "Civic issue"} complaint`,
            location: oldItem.location || "Not specified",
            description: oldItem.description || "Imported from the existing complaints.json file.",
            severity: ["Low", "Medium", "High", "Critical"].includes(oldItem.severity) ? oldItem.severity : "Medium",
            photoName,
            photo: photoName ? {
                filename: photoName,
                url: `/${encodeURIComponent(photoName)}`,
                mimeType: "",
                size: 0
            } : undefined,
            status: oldItem.status || "Reported",
            date: oldItem.date ? new Date(oldItem.date) : new Date()
        };

        const result = await Complaint.updateOne(
            { id: legacyId },
            { $setOnInsert: legacyDocument },
            { upsert: true }
        );
        if (result.upsertedCount > 0) imported++;
    }

    console.log(`Migration complete. ${imported} new complaint(s) imported; existing imported records were left unchanged.`);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(importComplaints)
    .then(() => mongoose.disconnect())
    .catch(async error => {
        console.error("Import failed:", error.message);
        await mongoose.disconnect().catch(() => {});
        process.exitCode = 1;
    });
