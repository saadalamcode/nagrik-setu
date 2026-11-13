
require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Issue = require("../src/models/issue.model");

const migrateIssues = async () => {
    try {
        await mongoose.connect(process.env.MONGODBURI);

        console.log("MongoDB connected");

        const filePath = path.join(__dirname, "..", "data", "issues.json");

        const data = fs.readFileSync(filePath, "utf8");

        const issues = JSON.parse(data);

        const existingCount = await Issue.countDocuments();

        if (existingCount > 0) {
            console.log("Migration stopped: the collection already contains issues.");
            return;
        }

        await Issue.insertMany(issues);

        console.log(issues.length + " issues migrated successfully");

    } catch (error) {
        console.log("Migration failed:", error.message);

    } finally {
        await mongoose.disconnect();
    }
};

migrateIssues();
