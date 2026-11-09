document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".issue-card");
    const filters = document.querySelectorAll(".filter");


    /* =========================
       SEARCH BAR
    ========================= */

    const search = document.createElement("input");

    search.type = "text";
    search.placeholder = "🔍 Search issues, locations, categories...";

    search.style.cssText = `
        width:100%;
        padding:12px 15px;
        margin-bottom:15px;
        border:1px solid #d8cdb7;
        border-radius:8px;
        outline:none;
        font-size:15px;
        box-sizing:border-box;
    `;

    const filterBox = document.querySelector(".issue-filters");

    filterBox.parentNode.insertBefore(search, filterBox);


    search.addEventListener("input", () => {

        const text = search.value.toLowerCase();

        cards.forEach(card => {

            card.style.display =
                card.textContent.toLowerCase().includes(text)
                    ? ""
                    : "none";

        });

    });



    /* =========================
       FILTERS
    ========================= */

    filters.forEach(button => {

        button.addEventListener("click", () => {

            filters.forEach(b =>
                b.classList.remove("active")
            );

            button.classList.add("active");

            const category =
                button.textContent.trim().toLowerCase();

            cards.forEach(card => {

                const text =
                    card.textContent.toLowerCase();

                card.style.display =
                    category === "all" ||
                    text.includes(category) ||
                    text.includes(category.replace("s", ""))
                        ? ""
                        : "none";

            });

        });

    });



    /* =========================
       REPORT ISSUE
    ========================= */

    document
        .querySelectorAll(".report-button, .nearby-report-button")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.preventDefault();

                window.location.href =
                    "report-issue.html";

            });

        });



    /* =========================
       VIEW ISSUE
    ========================= */

    cards.forEach(card => {

        const viewButton =
            card.querySelector(".issue-footer a");

        viewButton.addEventListener("click", event => {

            event.preventDefault();

            const title =
                card.querySelector("h3").textContent;

            const location =
                card.querySelector(".issue-location").textContent;

            const status =
                card.querySelector(".issue-status").textContent;

            const priority =
                card.querySelector(".issue-priority").textContent;

            const image =
                card.querySelector("img").src;


            const modal =
                document.createElement("div");

            modal.innerHTML = `

                <div class="modal-bg">

                    <div class="modal">

                        <button class="close">
                            ×
                        </button>

                        <img src="${image}">

                        <h2>${title}</h2>

                        <p>${location}</p>

                        <p>
                            <b>Priority:</b> ${priority}
                        </p>

                        <p>
                            <b>Status:</b> ${status}
                        </p>

                        <button class="affect">
                            ♡ This affects me
                        </button>

                    </div>

                </div>

            `;

            document.body.appendChild(modal);


            /* Close modal */

            modal
                .querySelector(".close")
                .onclick = () => modal.remove();


            modal
                .querySelector(".modal-bg")
                .onclick = e => {

                    if (e.target.classList.contains("modal-bg")) {
                        modal.remove();
                    }

                };


            /* Affects me */

            modal
                .querySelector(".affect")
                .onclick = function () {

                    this.textContent =
                        "✓ This affects me";

                    this.style.background =
                        "#198754";

                };

        });

    });



    /* =========================
       SAVE ISSUE
    ========================= */

    cards.forEach((card, index) => {

        const button =
            document.createElement("button");

        button.textContent =
            localStorage.getItem(`save${index}`)
                ? "★"
                : "☆";

        button.style.cssText = `
            position:absolute;
            top:15px;
            right:15px;
            border:0;
            border-radius:50%;
            background:white;
            font-size:22px;
            cursor:pointer;
            z-index:2;
        `;

        card.style.position = "relative";

        card.appendChild(button);


        button.onclick = event => {

            event.stopPropagation();

            if (localStorage.getItem(`save${index}`)) {

                localStorage.removeItem(`save${index}`);

                button.textContent = "☆";

            } else {

                localStorage.setItem(`save${index}`, "true");

                button.textContent = "★";

            }

        };

    });



    /* =========================
       PROFILE
    ========================= */

    const profile =
        document.querySelector(".profile-circle");

    profile.addEventListener("click", () => {

        let menu =
            document.querySelector(".profile-menu");

        if (menu) {

            menu.remove();

            return;

        }


        menu =
            document.createElement("div");

        menu.className =
            "profile-menu";

        menu.innerHTML = `

            <h3>Rupesh</h3>

            <p>Citizen Account</p>

            <hr>

            <div>📋 My Reports</div>

            <div>⭐ Saved Issues</div>

            <div>🚪 Logout</div>

        `;

        menu.style.cssText = `
            position:fixed;
            top:80px;
            right:25px;
            width:220px;
            background:white;
            padding:20px;
            border-radius:12px;
            box-shadow:0 8px 25px rgba(0,0,0,.2);
            z-index:9999;
        `;

        document.body.appendChild(menu);

    });

});