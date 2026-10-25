const filters = document.querySelectorAll(".filter-chips button");
const issues = document.querySelectorAll(".issue-row");
const manageButtons = document.querySelectorAll(".issue-row a");

filters.forEach(function(filter) {
    filter.addEventListener("click", function() {

        filters.forEach(function(button) {
            button.classList.remove("active");
        });

        filter.classList.add("active");

        let selected = filter.textContent;

        issues.forEach(function(issue) {
            let status = issue.querySelector(".status").textContent;

            if (selected === "All issues") {
                issue.style.display = "grid";
            } else if (selected === "In progress" && status === "In progress") {
                issue.style.display = "grid";
            } else if (selected === "Pending" && status === "Acknowledged") {
                issue.style.display = "grid";
            } else {
                issue.style.display = "none";
            }
        });
    });
});

manageButtons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();

        let issue = button.closest(".issue-row");
        let ticket = issue.querySelector(".ticket-id").textContent;
        let issueName = issue.children[1].textContent;
        let status = issue.querySelector(".status").textContent;

        alert(
            "Issue: " + ticket +
            "\nIssue: " + issueName +
            "\nStatus: " + status
        );
    });
});