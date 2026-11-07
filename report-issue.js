// Store selected category
let selectedCategory = "";


// Category buttons
const categoryButtons = document.querySelectorAll(".category-option");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove selection from all buttons
        categoryButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        // Select clicked button
        button.classList.add("selected");

        // Get category name
        selectedCategory = button.querySelector("strong").textContent;

        console.log("Selected category:", selectedCategory);
    });
});


// Submit complaint
document.getElementById("submitComplaint").addEventListener("click", async () => {

    const location = document.getElementById("issueLocation").value.trim();
    const description = document.getElementById("issueDescription").value.trim();
    const photo = document.getElementById("issuePhoto").files[0];

    // Validation
    if (selectedCategory === "") {
        alert("Please select an issue category.");
        return;
    }

    if (location === "") {
        alert("Please enter the location.");
        return;
    }

    if (description === "") {
        alert("Please describe the issue.");
        return;
    }


    // Data to send
    const complaint = {
        category: selectedCategory,
        location: location,
        description: description,
        photoName: photo ? photo.name : null
    };


    console.log("Sending complaint:", complaint);


    try {

        const response = await fetch("/api/complaints", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(complaint)

        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(data.message || "Failed to submit complaint");
        }


        console.log("Server response:", data);

        alert("Complaint submitted successfully!");


        // Clear form
        document.getElementById("issueLocation").value = "";
        document.getElementById("issueDescription").value = "";

        categoryButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        selectedCategory = "";

        document.getElementById("issuePhoto").value = "";


    } catch (error) {

        console.error("Error submitting complaint:", error);

        alert("Failed to submit complaint.");

    }

});