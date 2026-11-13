
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({

    ticket: {
        type: String,
        required: true,
        unique: true
    },

    issue: {
        type: String,
        required: true
    },

    severity: {
        type: String,
        required: true,
        enum: ["High", "Medium", "Low"]
    },

    location: {
        type: String,
        required: true
    },

    reported: {
        type: String,
        required: true
    },

    affected: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        required: true,
        enum: [
            "Reported",
            "Acknowledged",
            "In progress",
            "Awaiting verification",
            "Resolved"
        ]
    },

    department: {
        type: String,
        required: true
    },

    actionTaken: {
        type: String,
        default: ""
    }

});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
