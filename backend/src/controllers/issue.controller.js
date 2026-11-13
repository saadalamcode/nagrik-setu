
const Issue = require("../models/issue.model");


const getIssues = async (req, res) => {
    try {
        const issues = await Issue.find();
        res.json(issues);
    } catch (error) {
        res.status(500).json({
            error: "Could not retrieve issues."
        });
    }
};


const updateIssue = async (req, res) => {
    try {
        const ticket = req.params.ticket;

        const { status, actionTaken } = req.body;

        const issue = await Issue.findOneAndUpdate(
            { ticket: ticket },
            {
                status: status,
                actionTaken: actionTaken
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!issue) {
            return res.status(404).json({
                error: "Issue not found."
            });
        }

        res.json({
            message: "Issue updated successfully.",
            issue: issue
        });

    } catch (error) {
        res.status(500).json({
            error: "Could not update issue."
        });
    }
};

module.exports = {
    getIssues,
    updateIssue
};
