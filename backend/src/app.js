
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

const frontendPath = path.join(__dirname, "../../frontend");

app.use(express.static(frontendPath));

const issueRoutes = require("./routes/issue.route");

app.use("/api/issues", issueRoutes);

module.exports = app;
