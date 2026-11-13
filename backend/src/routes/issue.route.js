
const express = require("express");

const router = express.Router();

const {
    getIssues,
    updateIssue
} = require("../controllers/issue.controller");

router.get("/", getIssues);

router.put("/:ticket", updateIssue);

module.exports = router;
