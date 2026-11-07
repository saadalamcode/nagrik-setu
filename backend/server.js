const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve website
app.use(express.static(path.join(__dirname, "..")));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "homepage.html"));
});

// Test backend
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

// Save complaint
app.post("/api/complaints", (req, res) => {

    const filePath = path.join(__dirname, "data", "complaints.json");

    const complaints = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    const newComplaint = {
        id: complaints.length + 1,
        ...req.body,
        date: new Date().toISOString()
    };

    complaints.push(newComplaint);

    fs.writeFileSync(
        filePath,
        JSON.stringify(complaints, null, 2)
    );

    res.status(201).json({
        message: "Complaint saved successfully!",
        complaint: newComplaint
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});