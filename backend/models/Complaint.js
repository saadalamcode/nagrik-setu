const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    id: {
        type: Number,
        index: true
    },
    issueCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: [
            "Pothole",
            "Garbage",
            "Open sewer / drainage",
            "Streetlight",
            "Water supply",
            "Road damage",
            "Public sanitation",
            "Other"
        ]
    },
    title: {
        type: String,
        trim: true,
        maxlength: 120,
        default: ""
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 3000
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium"
    },
    photoName: {
        type: String,
        default: ""
    },
    photo: {
        filename: { type: String, default: "" },
        url: { type: String, default: "" },
        mimeType: { type: String, default: "" },
        size: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ["Reported", "Acknowledged", "In Progress", "Resolved", "Rejected"],
        default: "Reported",
        index: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: "complaints"
});

module.exports = mongoose.model("Complaint", complaintSchema);
