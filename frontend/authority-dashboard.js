const filters = document.querySelectorAll(".filter-chips button");

const popupOverlay = document.getElementById("popupOverlay");
const popupClose = document.getElementById("popupClose");
const popupContent = document.getElementById("popupContent");
const issueRows = document.getElementById("issueRows");

let issues = [];

fetch("/api/issues")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        issues = data;
        displayIssues(issues);
    })
    .catch(function(error) {
        console.log("Error loading issues:", error);
    });

function displayIssues(data) {

    issueRows.innerHTML = "";

    data.forEach(function(issue) {

        let statusClass = "";

        if (issue.status === "In progress") {
            statusClass = "progress";
        } else if (issue.status === "Acknowledged") {
            statusClass = "acknowledged";
        } else if (issue.status === "Reported") {
            statusClass = "reported";
        } else if (issue.status === "Resolved") {
            statusClass = "resolved";
        } else if (issue.status === "Awaiting verification") {
            statusClass = "verification";
        }

        let severityClass = issue.severity.toLowerCase();

        let row = document.createElement("div");
        row.className = "issue-row";

        row.innerHTML =
            "<div class='ticket-id'>" + issue.ticket + "</div>" +
            "<div>" + issue.issue + "</div>" +
            "<div><span class='severity " + severityClass + "'>" + issue.severity + "</span></div>" +
            "<div>" + issue.location + "</div>" +
            "<div>" + issue.reported + "</div>" +
            "<div>" + issue.affected + "</div>" +
            "<div><span class='status " + statusClass + "'>" + issue.status + "</span></div>" +
            "<div>" + issue.department + "</div>" +
            "<div><a href='#'>Manage</a></div>";

        issueRows.appendChild(row);

        let manageButton = row.querySelector("a");

        manageButton.addEventListener("click", function(event) {

            event.preventDefault();

            popupContent.innerHTML =
                "<h3>Manage Issue</h3>" +

                "<div class='popup-details'>" +
                "<p><strong>Ticket</strong><span>" + issue.ticket + "</span></p>" +
                "<p><strong>Issue</strong><span>" + issue.issue + "</span></p>" +
                "<p><strong>Location</strong><span>" + issue.location + "</span></p>" +
                "<p><strong>Department</strong><span>" + issue.department + "</span></p>" +
                "</div>" +

                "<div class='popup-form'>" +

                "<label for='issueStatus'>Update status</label>" +
                "<select id='issueStatus'>" +
                "<option value='Reported'>Reported</option>" +
                "<option value='Acknowledged'>Acknowledged</option>" +
                "<option value='In progress'>In progress</option>" +
                "<option value='Awaiting verification'>Awaiting verification</option>" +
                "<option value='Resolved'>Resolved</option>" +
                "</select>" +

                "<label for='actionTaken'>Action taken</label>" +
                "<textarea id='actionTaken' placeholder='Enter the action taken for this issue...'></textarea>" +

                "<button class='save-update' id='saveUpdate'>Save update</button>" +

                "</div>";

            document.getElementById("issueStatus").value = issue.status;
            document.getElementById("actionTaken").value = issue.actionTaken;

            popupOverlay.style.display = "flex";

            document.getElementById("saveUpdate").addEventListener("click", function() {

                let newStatus = document.getElementById("issueStatus").value;
                let actionTaken = document.getElementById("actionTaken").value.trim();

                if (actionTaken === "") {
                    alert("Please enter the action taken.");
                    return;
                }

                fetch("/api/issues/" + issue.ticket, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: newStatus,
                        actionTaken: actionTaken
                    })
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {

                    issue.status = newStatus;
                    issue.actionTaken = actionTaken;

                    displayIssues(issues);

                    popupContent.innerHTML =
                        "<div class='update-success'>" +
                        "<h3>Issue Updated</h3>" +
                        "<p><strong>Ticket:</strong> " + issue.ticket + "</p>" +
                        "<p>The issue has been updated to <strong>" + newStatus + "</strong>.</p>" +
                        "<p><strong>Action taken:</strong> " + actionTaken + "</p>" +
                        "</div>";
                })
                .catch(function(error) {
                    console.log("Error saving update:", error);
                    alert("Could not save the update.");
                });
            });
        });
    });
}

filters.forEach(function(filter) {

    filter.addEventListener("click", function() {

        filters.forEach(function(button) {
            button.classList.remove("active");
        });

        filter.classList.add("active");

        let selected = filter.textContent.trim();

        if (selected === "All issues") {
            displayIssues(issues);
            return;
        }

        let filteredIssues = issues.filter(function(issue) {

            if (selected === "In progress") {
                return issue.status === "In progress";
            }

            if (selected === "Pending") {
                return issue.status === "Acknowledged";
            }

            if (selected === "Resolved") {
                return issue.status === "Resolved";
            }

            if (selected === "Urgent") {
                return issue.severity === "High";
            }

            return true;
        });

        displayIssues(filteredIssues);
    });
});

popupClose.addEventListener("click", function() {
    popupOverlay.style.display = "none";
});

popupOverlay.addEventListener("click", function(event) {

    if (event.target === popupOverlay) {
        popupOverlay.style.display = "none";
    }

});