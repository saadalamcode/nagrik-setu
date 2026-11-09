
"use strict";

// ======================================================
// 1. DOM SELECTION AND MANIPULATION
// ======================================================

console.log("Nagrik Setu Leaderboard JavaScript Started!");

// Selecting HTML elements

const heading = document.querySelector(".leaderboard-hero h1");

const heroSection = document.querySelector(".leaderboard-hero");

const heroDescription = document.querySelector(".leaderboard-hero-content p");

const leaderboardTable = document.querySelector(".leaderboard-table");

const tableBody = document.querySelector(".leaderboard-table tbody");

const rankCards = document.querySelectorAll(".rank-card");

const pointsCard = document.querySelector(".points-card");

const tableRows = document.querySelectorAll(
    ".leaderboard-table tbody tr"
);

// Check whether important elements exist

if (
    !heading ||
    !heroSection ||
    !leaderboardTable ||
    !tableBody ||
    !pointsCard
) {
    console.error("Some required HTML elements were not found.");
} else {
    console.log("All important DOM elements selected successfully.");
}

// Reading HTML content

console.log("Page Heading:", heading.textContent);

console.log("Total Citizens:", tableRows.length);


// Create an issue API status message dynamically

const issueStatusMessage = document.createElement("p");

issueStatusMessage.className = "issue-status-message";

issueStatusMessage.textContent = "Loading issue information...";

issueStatusMessage.style.marginTop = "18px";
issueStatusMessage.style.fontSize = "13px";
issueStatusMessage.style.color = "#35606B";

heroDescription.insertAdjacentElement(
    "afterend",
    issueStatusMessage
);


// ======================================================
// 2. EVENTS AND CALLBACK FUNCTIONS
// ======================================================

// Event delegation: one listener handles all table rows

tableBody.addEventListener("click", function (event) {

    // Find the row that was clicked

    const clickedRow = event.target.closest("tr");

    // Ignore clicks outside table rows

    if (!clickedRow) {
        return;
    }

    // Get citizen information

    const citizenName = clickedRow.querySelector(
        ".citizen-cell span"
    ).textContent;

    const citizenPoints = clickedRow.querySelector(
        ".table-points"
    ).textContent;

    // Display information

    console.log("Selected Citizen:", citizenName);

    console.log("Citizen Points:", citizenPoints);

    // Highlight selected row

    tableRows.forEach(function (row) {
        row.style.backgroundColor = "";
    });

    clickedRow.style.backgroundColor = "#EFE7D2";
});


// Event listener for top-three cards

rankCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const citizenName = card.querySelector("h3").textContent;

        const citizenPoints = card.querySelector(
            ".rank-points"
        ).textContent;

        console.log("Top Citizen:", citizenName);

        console.log("Points:", citizenPoints);

    });

});


// ======================================================
// 3. HIGHER-ORDER FUNCTIONS AND ARRAY METHODS
// ======================================================

// Convert HTML table rows into a JavaScript array

const citizens = Array.from(tableRows).map(function (row) {

    const columns = row.querySelectorAll("td");

    return {
        rank: Number(columns[0].textContent),

        name: columns[1].querySelector("span").textContent,

        locality: columns[2].textContent,

        points: Number(
            columns[3].textContent.replace(/,/g, "")
        ),

        reported: Number(columns[4].textContent),

        supported: Number(columns[5].textContent),

        verified: Number(columns[6].textContent)
    };

});

console.log("Citizens Array:", citizens);


// MAP: Extract only citizen names

const citizenNames = citizens.map(function (citizen) {
    return citizen.name;
});

console.log("Citizen Names:", citizenNames);


// FILTER: Find citizens with more than 1500 points

const highScoringCitizens = citizens.filter(function (citizen) {
    return citizen.points > 1500;
});

console.log("Citizens with more than 1500 points:", highScoringCitizens);


// REDUCE: Calculate total leaderboard points

const totalPoints = citizens.reduce(function (total, citizen) {
    return total + citizen.points;
}, 0);

console.log("Total Leaderboard Points:", totalPoints);


// REDUCE: Calculate average points

const averagePoints = totalPoints / citizens.length;

console.log("Average Points:", averagePoints);


// SORT: Create a sorted copy of citizens by points

const sortedCitizens = [...citizens].sort(function (a, b) {
    return b.points - a.points;
});

console.log("Citizens Sorted by Points:", sortedCitizens);


// FIND: Find the citizen with the highest points

const topCitizen = sortedCitizens.find(function (citizen) {
    return citizen.points === sortedCitizens[0].points;
});

console.log("Top Scoring Citizen:", topCitizen);


// ======================================================
// 4. PROMISES AND PROMISE CHAINING
// ======================================================

// This function returns a Promise.
// It resolves after the specified time.

function createDemoPromise() {

    return new Promise(function (resolve, reject) {

        const isSuccessful = true;

        setTimeout(function () {

            if (isSuccessful) {

                resolve("Promise executed successfully!");

            } else {

                reject(new Error("Promise execution failed."));

            }

        }, 1000);

    });

}


// Promise chaining

createDemoPromise()

    .then(function (message) {

        console.log("Promise Result:", message);

        return "Moving to the next .then()";

    })

    .then(function (message) {

        console.log(message);

    })

    .catch(function (error) {

        console.error("Promise Error:", error.message);

    })

    .finally(function () {

        console.log("Promise execution finished.");

    });


// ======================================================
// 5. ASYNC/AWAIT AND ERROR HANDLING
// ======================================================

// Async functions always return a Promise.

async function checkLeaderboardData() {

    try {

        console.log("Checking leaderboard data...");

        const result = await createDemoPromise();

        console.log("Async/Await Result:", result);

    } catch (error) {

        console.error("Async Error:", error.message);

    } finally {

        console.log("Async function completed.");

    }

}

// Execute the async function

checkLeaderboardData();


// ======================================================
// 6. FETCH API AND API INTEGRATION
// ======================================================

// Fetch issue data from the existing Express API

function fetchIssues() {

    return fetch("/api/issues")

        .then(function (response) {

            // Check HTTP response status

            if (!response.ok) {

                throw new Error(
                    "HTTP Error: " + response.status
                );

            }

            // Convert response into JavaScript data

            return response.json();

        })

        .then(function (data) {

            // Validate the expected API response

            if (!Array.isArray(data)) {

                throw new Error(
                    "Invalid API response. Expected an array."
                );

            }

            console.log("Issues Successfully Fetched:", data);

            return data;

        })

        .catch(function (error) {

            console.error("Fetch Error:", error.message);

            throw error;

        });

}


// Use async/await to process fetched issue data

async function loadIssueData() {

    try {

        issueStatusMessage.textContent =
            "Loading issue information...";

        // Wait until API data arrives

        const issues = await fetchIssues();

        // Total number of issues

        const totalIssues = issues.length;

        // FILTER: Find reported issues

        const reportedIssues = issues.filter(function (issue) {

            return issue.status === "Reported";

        });

        // FILTER: Find resolved issues

        const resolvedIssues = issues.filter(function (issue) {

            return issue.status === "Resolved";

        });

        // MAP: Extract ticket IDs

        const ticketIDs = issues.map(function (issue) {

            return issue.ticket;

        });

        // REDUCE: Count issues by severity

        const severitySummary = issues.reduce(
            function (summary, issue) {

                const severity = issue.severity || "Unknown";

                summary[severity] = (summary[severity] || 0) + 1;

                return summary;

            },
            {}
        );

        // Display API results in Console

        console.log("Total Issues:", totalIssues);

        console.log("Reported Issues:", reportedIssues);

        console.log("Resolved Issues:", resolvedIssues);

        console.log("Ticket IDs:", ticketIDs);

        console.log("Severity Summary:", severitySummary);


        // Update the webpage

        issueStatusMessage.textContent =
            `Issue data loaded successfully: ${totalIssues} issues found. ` +
            `${reportedIssues.length} reported and ` +
            `${resolvedIssues.length} resolved.`;

        issueStatusMessage.style.color = "#35606B";


    } catch (error) {

        console.error("Unable to load issue data:", error.message);

        issueStatusMessage.textContent =
            "Unable to load issue information. Please try again.";

        issueStatusMessage.style.color = "#B42318";

    }

}


// ======================================================
// INITIALIZE LEADERBOARD
// ======================================================

console.log("Leaderboard DOM and JavaScript initialized!");

// Start API integration

loadIssueData();
