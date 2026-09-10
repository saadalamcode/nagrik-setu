/* =========================================================
   NAGRIK-SETU — REPORT ISSUE
   Frontend interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================== */

    const photoInput = document.getElementById("issue-photo");
    const uploadBox = document.getElementById("upload-box");
    const uploadError = document.getElementById("upload-error");

    const imagePreview = document.getElementById("image-preview");
    const uploadTitle = document.getElementById("upload-title");

    const categoryCards =
        document.querySelectorAll(".category-card");

    const categoryError =
        document.getElementById("category-error");

    const continueButton =
        document.getElementById("continue-button");


    /* =========================
       STATE
    ========================== */

    let selectedCategory = null;


    /* =========================
       PHOTO UPLOAD
    ========================== */

    photoInput.addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        handleFile(file);

    });


    function handleFile(file) {

        uploadError.textContent = "";

        /* Check file type */

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            uploadError.textContent =
                "Please upload a JPG, PNG or WEBP image.";

            photoInput.value = "";

            return;
        }


        /* Check file size */

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {

            uploadError.textContent =
                "Image must be smaller than 10 MB.";

            photoInput.value = "";

            return;
        }


        /* Create preview */

        const reader = new FileReader();

        reader.onload = (event) => {

            imagePreview.src = event.target.result;

            uploadBox.classList.add("has-image");

            uploadTitle.textContent = file.name;

        };

        reader.readAsDataURL(file);
    }


    /* =========================
       DRAG & DROP
    ========================== */

    [
        "dragenter",
        "dragover"
    ].forEach(eventName => {

        uploadBox.addEventListener(eventName, (event) => {

            event.preventDefault();

            uploadBox.classList.add("drag-over");

        });

    });


    [
        "dragleave",
        "drop"
    ].forEach(eventName => {

        uploadBox.addEventListener(eventName, (event) => {

            event.preventDefault();

            uploadBox.classList.remove("drag-over");

        });

    });


    uploadBox.addEventListener("drop", (event) => {

        const file = event.dataTransfer.files[0];

        if (!file) {
            return;
        }

        handleFile(file);

    });


    /* =========================
       CATEGORY SELECTION
    ========================== */

    categoryCards.forEach(card => {

        card.addEventListener("click", () => {

            /* Remove previous selection */

            categoryCards.forEach(item => {
                item.classList.remove("selected");
            });


            /* Select current card */

            card.classList.add("selected");

            selectedCategory =
                card.dataset.category;


            /* Clear error */

            categoryError.textContent = "";

        });

    });


    /* =========================
       CONTINUE BUTTON
    ========================== */

    continueButton.addEventListener("click", () => {

        let valid = true;


        /* Category validation */

        if (!selectedCategory) {

            categoryError.textContent =
                "Please select an issue category.";

            valid = false;

        }


        if (!valid) {

            if (!selectedCategory) {

                document
                    .getElementById("category-grid")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

            }

            return;
        }


        /* Temporary frontend behavior */

        alert(
            `Issue category selected: ${selectedCategory}\n\n` +
            "Step 1 completed. The next details screen can now be connected."
        );

    });

});