const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const filePath = path.join(__dirname, "data", "issues.json");

app.get("/api/issues", function(req, res) {
    fs.readFile(filePath, "utf8", function(error, data) {
        if (error) {
            return res.status(500).json({ error: "Could not read issues." });
        }

        res.json(JSON.parse(data));
    });
});

app.put("/api/issues/:ticket", function(req, res) {
    fs.readFile(filePath, "utf8", function(error, data) {
        if (error) {
            return res.status(500).json({ error: "Could not read issues." });
        }

        let issues = JSON.parse(data);
        let ticket = req.params.ticket;

        let issue = issues.find(function(item) {
            return item.ticket === ticket;
        });

        if (!issue) {
            return res.status(404).json({ error: "Issue not found." });
        }

        issue.status = req.body.status;
        issue.actionTaken = req.body.actionTaken;

        fs.writeFile(filePath, JSON.stringify(issues, null, 4), function(error) {
            if (error) {
                return res.status(500).json({ error: "Could not save issue." });
            }

            res.json({
                message: "Issue updated successfully.",
                issue: issue
            });
        });
    });
});

app.listen(PORT, function() {
    console.log("Server running at http://localhost:" + PORT);
});