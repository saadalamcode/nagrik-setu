/* ==========================================================
   NAGRIK SETU
   FRONTEND JAVASCRIPT
   DOM + EVENT HANDLING + LOCAL STORAGE
   NO BACKEND
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Nagrik Setu JS Loaded");

    /* ======================================================
       BASIC DOM ELEMENTS
    ====================================================== */

    const issueCards = document.querySelectorAll(".issue-card");
    const filterButtons = document.querySelectorAll(".filter");

    const reportButtons = document.querySelectorAll(
        ".report-button, .nearby-report-button"
    );

    const profileButton =
        document.querySelector(".profile-circle");

    const howCard =
        document.querySelector(".how-card");



    /* ======================================================
       TOAST NOTIFICATION
    ====================================================== */

    function showToast(message, type = "success") {

        const oldToast =
            document.querySelector(".ns-toast");

        if (oldToast) {
            oldToast.remove();
        }

        const toast =
            document.createElement("div");

        toast.className = "ns-toast";

        toast.textContent = message;

        Object.assign(toast.style, {

            position: "fixed",
            bottom: "25px",
            right: "25px",
            zIndex: "99999",

            background:
                type === "error"
                    ? "#c0392b"
                    : "#123b5d",

            color: "#ffffff",

            padding: "14px 20px",

            borderRadius: "8px",

            fontSize: "14px",

            fontWeight: "600",

            boxShadow:
                "0 8px 25px rgba(0,0,0,0.2)",

            opacity: "0",

            transform:
                "translateY(20px)",

            transition:
                "all 0.3s ease"

        });

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.style.opacity = "1";
            toast.style.transform =
                "translateY(0)";

        }, 10);

        setTimeout(() => {

            toast.style.opacity = "0";
            toast.style.transform =
                "translateY(20px)";

            setTimeout(() => {
                toast.remove();
            }, 300);

        }, 2500);
    }



    /* ======================================================
       1. CREATE SEARCH BAR
    ====================================================== */

    const issueGrid =
        document.querySelector(".issue-grid");

    if (issueGrid) {

        const searchWrapper =
            document.createElement("div");

        searchWrapper.className =
            "js-search-wrapper";

        Object.assign(searchWrapper.style, {

            width: "100%",

            marginBottom: "20px",

            position: "relative"

        });



        const searchIcon =
            document.createElement("span");

        searchIcon.textContent = "🔍";

        Object.assign(searchIcon.style, {

            position: "absolute",

            left: "15px",

            top: "50%",

            transform: "translateY(-50%)",

            fontSize: "16px",

            pointerEvents: "none"

        });



        const searchInput =
            document.createElement("input");

        searchInput.type = "text";

        searchInput.id =
            "issueSearch";

        searchInput.placeholder =
            "Search issues, locations, categories...";



        Object.assign(searchInput.style, {

            width: "100%",

            boxSizing: "border-box",

            padding: "14px 18px 14px 45px",

            border: "1px solid #d8cdb7",

            borderRadius: "10px",

            outline: "none",

            background: "#ffffff",

            fontSize: "15px",

            fontFamily: "Inter, sans-serif",

            color: "#123b5d"

        });



        searchInput.addEventListener(
            "focus",
            () => {

                searchInput.style.borderColor =
                    "#123b5d";

                searchInput.style.boxShadow =
                    "0 0 0 3px rgba(18,59,93,0.10)";

            }
        );



        searchInput.addEventListener(
            "blur",
            () => {

                searchInput.style.borderColor =
                    "#d8cdb7";

                searchInput.style.boxShadow =
                    "none";

            }
        );



        searchWrapper.appendChild(
            searchIcon
        );

        searchWrapper.appendChild(
            searchInput
        );



        /*
           Insert search bar immediately
           before issue filters
        */

        const filterContainer =
            document.querySelector(
                ".issue-filters"
            );

        if (filterContainer) {

            filterContainer.parentNode.insertBefore(
                searchWrapper,
                filterContainer
            );

        } else {

            issueGrid.parentNode.insertBefore(
                searchWrapper,
                issueGrid
            );

        }



        /* ==================================================
           SEARCH EVENT
        ================================================== */

        searchInput.addEventListener(
            "input",
            function () {

                const search =
                    this.value
                        .trim()
                        .toLowerCase();

                let count = 0;

                issueCards.forEach(card => {

                    const cardText =
                        card.textContent
                            .toLowerCase();

                    if (
                        cardText.includes(search)
                    ) {

                        card.style.display =
                            "";

                        count++;

                    } else {

                        card.style.display =
                            "none";

                    }

                });



                updateSearchResult(
                    search,
                    count
                );

            }
        );

    }



    /* ======================================================
       SEARCH RESULT TEXT
    ====================================================== */

    function updateSearchResult(
        search,
        count
    ) {

        let result =
            document.querySelector(
                "#search-result"
            );

        if (!result) {

            result =
                document.createElement("div");

            result.id =
                "search-result";

            Object.assign(result.style, {

                marginTop: "7px",

                fontSize: "13px",

                color: "#777"

            });

            const wrapper =
                document.querySelector(
                    ".js-search-wrapper"
                );

            if (wrapper) {
                wrapper.appendChild(result);
            }

        }



        if (!search) {

            result.textContent = "";

        } else {

            result.textContent =
                `${count} issue${count !== 1 ? "s" : ""} found`;

        }

    }



    /* ======================================================
       2. FILTER BUTTONS
    ====================================================== */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                /*
                   Remove active
                   from every button
                */

                filterButtons.forEach(btn => {
                    btn.classList.remove("active");
                });



                /*
                   Add active to
                   clicked button
                */

                this.classList.add("active");



                const category =
                    this.textContent
                        .trim()
                        .toLowerCase();



                let count = 0;



                issueCards.forEach(card => {

                    const cardText =
                        card.textContent
                            .toLowerCase();



                    let shouldShow = false;



                    if (
                        category === "all"
                    ) {

                        shouldShow = true;

                    } else {

                        /*
                           Handles:
                           Potholes
                           Open sewers
                           Streetlights
                           Garbage

                           while your card contains:
                           Potholes
                           Open sewer
                           Streetlight
                           Garbage
                        */

                        shouldShow =
                            cardText.includes(
                                category
                            );



                        /*
                           Singular/plural handling
                        */

                        if (!shouldShow) {

                            const singular =
                                category.endsWith("s")
                                    ? category.slice(0, -1)
                                    : category;

                            shouldShow =
                                cardText.includes(
                                    singular
                                );

                        }

                    }



                    if (shouldShow) {

                        card.style.display =
                            "";

                        card.style.opacity =
                            "0";

                        setTimeout(() => {

                            card.style.transition =
                                "opacity 0.3s ease";

                            card.style.opacity =
                                "1";

                        }, 20);

                        count++;

                    } else {

                        card.style.display =
                            "none";

                    }

                });



                /*
                   Save selected filter
                */

                localStorage.setItem(
                    "nagrikFilter",
                    category
                );



                showToast(
                    `${count} ${category} issue${count !== 1 ? "s" : ""}`
                );

            }
        );

    });



    /* ======================================================
       3. RESTORE FILTER
    ====================================================== */

    const savedFilter =
        localStorage.getItem(
            "nagrikFilter"
        );

    if (savedFilter) {

        filterButtons.forEach(button => {

            if (
                button.textContent
                    .trim()
                    .toLowerCase()
                === savedFilter
            ) {

                button.click();

            }

        });

    }



    /* ======================================================
       4. REPORT ISSUE BUTTON
    ====================================================== */

    reportButtons.forEach(button => {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showToast(
                    "Opening Report Issue..."
                );

                setTimeout(() => {

                    window.location.href =
                        "report-issue.html";

                }, 300);

            }
        );

    });



    /* ======================================================
       5. VIEW ISSUE MODAL
    ====================================================== */

    const viewIssueLinks =
        document.querySelectorAll(
            ".issue-card .issue-footer a"
        );



    viewIssueLinks.forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                const card =
                    this.closest(
                        ".issue-card"
                    );

                if (card) {

                    openIssueModal(
                        card
                    );

                }

            }
        );

    });



    /* ======================================================
       OPEN ISSUE MODAL
    ====================================================== */

    function openIssueModal(card) {

        const title =
            card.querySelector("h3")
                ?.textContent
                .trim()
            || "Issue";



        const location =
            card.querySelector(
                ".issue-location"
            )
                ?.textContent
                .trim()
            || "Location unavailable";



        const issueId =
            card.querySelector(
                ".issue-id"
            )
                ?.textContent
                .trim()
            || "";



        const priority =
            card.querySelector(
                ".issue-priority"
            )
                ?.textContent
                .trim()
            || "";



        const status =
            card.querySelector(
                ".issue-status"
            )
                ?.textContent
                .trim()
            || "";



        const image =
            card.querySelector(
                ".issue-image img"
            )?.src
            || "";



        /*
           Your HTML has:
           ♧ 47 affected
           ♧ 12 updates

           So we extract them directly.
        */

        const footerSpans =
            card.querySelectorAll(
                ".issue-footer span"
            );



        const affected =
            footerSpans[0]
                ?.textContent
                .trim()
            || "0 affected";



        const updates =
            footerSpans[1]
                ?.textContent
                .trim()
            || "0 updates";



        /* ----------------------------------------------
           CREATE OVERLAY
        ---------------------------------------------- */

        const overlay =
            document.createElement("div");

        overlay.className =
            "ns-modal-overlay";



        Object.assign(
            overlay.style,
            {

                position: "fixed",

                inset: "0",

                background:
                    "rgba(0,0,0,0.60)",

                display: "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                padding: "20px",

                zIndex: "99999"

            }
        );



        /* ----------------------------------------------
           CREATE MODAL
        ---------------------------------------------- */

        const modal =
            document.createElement("div");



        Object.assign(
            modal.style,
            {

                width: "100%",

                maxWidth: "650px",

                maxHeight: "90vh",

                overflowY: "auto",

                background: "#ffffff",

                borderRadius: "15px",

                padding: "25px",

                position: "relative",

                boxSizing: "border-box",

                boxShadow:
                    "0 20px 60px rgba(0,0,0,0.3)"

            }
        );



        modal.innerHTML = `

            <button id="closeIssueModal"
                style="
                    position:absolute;
                    top:12px;
                    right:15px;
                    border:none;
                    background:none;
                    font-size:28px;
                    cursor:pointer;
                    color:#555;
                ">
                ×
            </button>


            <img src="${image}"
                style="
                    width:100%;
                    max-height:280px;
                    object-fit:cover;
                    border-radius:10px;
                    margin-bottom:18px;
                ">


            <div style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                margin-bottom:12px;
            ">

                <span style="
                    padding:6px 10px;
                    border-radius:20px;
                    background:#fff3cd;
                    font-size:13px;
                ">
                    ${priority}
                </span>

                <span style="
                    padding:6px 10px;
                    border-radius:20px;
                    background:#e8f5e9;
                    font-size:13px;
                ">
                    ${status}
                </span>

            </div>


            <h2 style="
                color:#123b5d;
                margin:8px 0;
            ">
                ${title}
            </h2>


            <p style="
                color:#777;
                margin-bottom:5px;
            ">
                ${location}
            </p>


            <p style="
                color:#888;
                font-size:13px;
            ">
                ${issueId}
            </p>


            <hr style="
                margin:20px 0;
                border:none;
                border-top:1px solid #eee;
            ">


            <h3>
                Issue Information
            </h3>


            <div style="
                display:flex;
                gap:40px;
                margin-top:15px;
            ">

                <div>
                    <strong>
                        ${affected}
                    </strong>

                    <br>

                    <small>
                        People affected
                    </small>
                </div>


                <div>
                    <strong>
                        ${updates}
                    </strong>

                    <br>

                    <small>
                        Updates
                    </small>
                </div>

            </div>


            <hr style="
                margin:20px 0;
                border:none;
                border-top:1px solid #eee;
            ">


            <h3>
                Issue Progress
            </h3>


            <div style="
                margin-top:15px;
                line-height:2.3;
            ">

                <div>🟢 Issue Reported</div>

                <div>🟢 Authority Notified</div>

                <div>🟢 Inspection</div>

                <div>🟡 Work Started</div>

                <div>⚪ Resolved</div>

            </div>


            <button id="affectsMeButton"
                style="
                    width:100%;
                    margin-top:20px;
                    padding:12px;
                    border:none;
                    border-radius:8px;
                    background:#123b5d;
                    color:white;
                    cursor:pointer;
                    font-weight:600;
                ">
                ♡ This affects me
            </button>

        `;



        overlay.appendChild(
            modal
        );

        document.body.appendChild(
            overlay
        );



        /* ----------------------------------------------
           CLOSE BUTTON
        ---------------------------------------------- */

        const closeButton =
            document.querySelector(
                "#closeIssueModal"
            );



        closeButton.addEventListener(
            "click",
            () => {

                overlay.remove();

            }
        );



        /* ----------------------------------------------
           CLICK OUTSIDE
        ---------------------------------------------- */

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === overlay
                ) {

                    overlay.remove();

                }

            }
        );



        /* ----------------------------------------------
           ESC KEY
        ---------------------------------------------- */

        function escapeHandler(event) {

            if (
                event.key === "Escape"
            ) {

                overlay.remove();

                document.removeEventListener(
                    "keydown",
                    escapeHandler
                );

            }

        }



        document.addEventListener(
            "keydown",
            escapeHandler
        );



        /* ==================================================
           THIS AFFECTS ME
        ================================================== */

        const affectsButton =
            document.querySelector(
                "#affectsMeButton"
            );



        const storageKey =
            "affectsMe_" +
            issueId;



        if (
            localStorage.getItem(
                storageKey
            )
        ) {

            affectsButton.textContent =
                "✓ This affects me";

            affectsButton.style.background =
                "#198754";

        }



        affectsButton.addEventListener(
            "click",
            () => {

                if (
                    localStorage.getItem(
                        storageKey
                    )
                ) {

                    localStorage.removeItem(
                        storageKey
                    );

                    affectsButton.textContent =
                        "♡ This affects me";

                    affectsButton.style.background =
                        "#123b5d";

                    showToast(
                        "Removed from affected issues"
                    );

                } else {

                    localStorage.setItem(
                        storageKey,
                        "true"
                    );

                    affectsButton.textContent =
                        "✓ This affects me";

                    affectsButton.style.background =
                        "#198754";

                    showToast(
                        "Issue marked as affecting you"
                    );

                }

            }
        );

    }



    /* ======================================================
       6. SAVE / BOOKMARK
    ====================================================== */

    issueCards.forEach((card, index) => {

        const title =
            card.querySelector("h3")
                ?.textContent
                .trim()
            || `Issue ${index}`;



        const saveKey =
            "savedIssue_" +
            title;



        /*
           Make card position relative
        */

        card.style.position =
            "relative";



        /*
           Create bookmark button
        */

        const saveButton =
            document.createElement("button");



        saveButton.className =
            "js-save-button";



        saveButton.innerHTML =
            localStorage.getItem(
                saveKey
            )
                ? "★"
                : "☆";



        saveButton.title =
            "Save issue";



        Object.assign(
            saveButton.style,
            {

                position: "absolute",

                top: "15px",

                right: "15px",

                width: "40px",

                height: "40px",

                borderRadius: "50%",

                border: "none",

                background: "#ffffff",

                fontSize: "22px",

                cursor: "pointer",

                zIndex: "10",

                boxShadow:
                    "0 2px 8px rgba(0,0,0,0.15)"

            }
        );



        card.appendChild(
            saveButton
        );



        saveButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();



                if (
                    localStorage.getItem(
                        saveKey
                    )
                ) {

                    localStorage.removeItem(
                        saveKey
                    );

                    saveButton.innerHTML =
                        "☆";

                    showToast(
                        "Issue removed from saved"
                    );

                } else {

                    localStorage.setItem(
                        saveKey,
                        "true"
                    );

                    saveButton.innerHTML =
                        "★";

                    showToast(
                        "Issue saved ⭐"
                    );

                }

            }
        );

    });



    /* ======================================================
       7. PROFILE DROPDOWN
    ====================================================== */

    if (profileButton) {

        profileButton.style.cursor =
            "pointer";



        profileButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleProfileMenu();

            }
        );

    }



    function toggleProfileMenu() {

        let menu =
            document.querySelector(
                ".js-profile-menu"
            );



        /*
           If already open,
           remove it.
        */

        if (menu) {

            menu.remove();

            return;

        }



        menu =
            document.createElement("div");

        menu.className =
            "js-profile-menu";



        Object.assign(
            menu.style,
            {

                position: "fixed",

                top: "80px",

                right: "25px",

                width: "230px",

                background: "#ffffff",

                borderRadius: "12px",

                padding: "18px",

                zIndex: "99998",

                boxShadow:
                    "0 10px 35px rgba(0,0,0,0.2)"

            }
        );



        menu.innerHTML = `

            <div style="
                border-bottom:1px solid #eee;
                padding-bottom:12px;
                margin-bottom:8px;
            ">

                <strong>
                    Rupesh
                </strong>

                <br>

                <small style="
                    color:#777;
                ">
                    Citizen Account
                </small>

            </div>


            <button
                class="profile-option"
                id="myReportsButton">
                📋 My Reports
            </button>


            <button
                class="profile-option"
                id="savedIssuesButton">
                ⭐ Saved Issues
            </button>


            <button
                class="profile-option"
                id="logoutButton">
                🚪 Logout
            </button>

        `;



        document.body.appendChild(
            menu
        );



        /* Button CSS */

        menu.querySelectorAll(
            ".profile-option"
        ).forEach(button => {

            Object.assign(
                button.style,
                {

                    display: "block",

                    width: "100%",

                    border: "none",

                    background: "transparent",

                    textAlign: "left",

                    padding: "12px 5px",

                    cursor: "pointer",

                    fontSize: "14px"

                }
            );



            button.addEventListener(
                "mouseenter",
                () => {

                    button.style.background =
                        "#f5f5f5";

                }
            );



            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.background =
                        "transparent";

                }
            );

        });



        /*
           My Reports
        */

        document
            .querySelector(
                "#myReportsButton"
            )
            .addEventListener(
                "click",
                () => {

                    showToast(
                        "My Reports opened"
                    );

                }
            );



        /*
           Saved Issues
        */

        document
            .querySelector(
                "#savedIssuesButton"
            )
            .addEventListener(
                "click",
                () => {

                    showSavedIssues();

                }
            );



        /*
           Logout
        */

        document
            .querySelector(
                "#logoutButton"
            )
            .addEventListener(
                "click",
                () => {

                    localStorage.removeItem(
                        "nagrikUser"
                    );

                    menu.remove();

                    showToast(
                        "Logged out successfully"
                    );

                }
            );

    }



    /* ======================================================
       CLOSE PROFILE WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener(
        "click",
        event => {

            const menu =
                document.querySelector(
                    ".js-profile-menu"
                );

            if (
                menu &&
                !menu.contains(event.target) &&
                event.target !== profileButton
            ) {

                menu.remove();

            }

        }
    );



    /* ======================================================
       8. SAVED ISSUES
    ====================================================== */

    function showSavedIssues() {

        let savedCount = 0;



        issueCards.forEach(card => {

            const title =
                card.querySelector("h3")
                    ?.textContent
                    .trim();



            if (
                title &&
                localStorage.getItem(
                    "savedIssue_" +
                    title
                )
            ) {

                savedCount++;

            }

        });



        showToast(
            `${savedCount} saved issue${savedCount !== 1 ? "s" : ""}`
        );

    }



    /* ======================================================
       9. HOW DOES NAGRIK SETU WORK?
    ====================================================== */

    if (howCard) {

        howCard.style.cursor =
            "pointer";



        howCard.addEventListener(
            "click",
            openHowItWorks
        );

    }



    function openHowItWorks() {

        const overlay =
            document.createElement("div");



        Object.assign(
            overlay.style,
            {

                position: "fixed",

                inset: "0",

                background:
                    "rgba(0,0,0,0.6)",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                padding: "20px",

                zIndex: "99999"

            }
        );



        const modal =
            document.createElement("div");



        Object.assign(
            modal.style,
            {

                background: "#ffffff",

                width: "100%",

                maxWidth: "520px",

                padding: "30px",

                borderRadius: "15px",

                boxSizing: "border-box"

            }
        );



        modal.innerHTML = `

            <h2 style="
                color:#123b5d;
            ">
                How does Nagrik Setu work?
            </h2>

            <br>

            <p>
                📝 <strong>1. Report</strong>
                <br>
                Citizens report civic problems
                in their locality.
            </p>

            <br>

            <p>
                🔍 <strong>2. Track</strong>
                <br>
                Citizens can track the progress
                of reported issues.
            </p>

            <br>

            <p>
                🏛️ <strong>3. Authority Response</strong>
                <br>
                Relevant authorities review
                and process issues.
            </p>

            <br>

            <p>
                ✅ <strong>4. Resolution</strong>
                <br>
                Citizens can see when the issue
                has been resolved.
            </p>

            <button id="closeHowButton"
                style="
                    width:100%;
                    padding:12px;
                    margin-top:20px;
                    border:none;
                    border-radius:8px;
                    background:#123b5d;
                    color:white;
                    cursor:pointer;
                ">
                Close
            </button>

        `;



        overlay.appendChild(
            modal
        );

        document.body.appendChild(
            overlay
        );



        document
            .querySelector(
                "#closeHowButton"
            )
            .addEventListener(
                "click",
                () => overlay.remove()
            );



        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === overlay
                ) {

                    overlay.remove();

                }

            }
        );

    }



    /* ======================================================
       10. STATISTICS ANIMATION
    ====================================================== */

    const statNumbers =
        document.querySelectorAll(
            ".stat-number"
        );



    statNumbers.forEach(element => {

        const original =
            element.textContent
                .trim();



        const numberMatch =
            original.match(
                /[\d,.]+/
            );



        if (!numberMatch) {
            return;
        }



        const number =
            parseFloat(
                numberMatch[0]
                    .replace(/,/g, "")
            );



        if (isNaN(number)) {
            return;
        }



        const suffix =
            original.substring(
                numberMatch[0].length
            );



        let current = 0;

        const duration =
            1200;

        const start =
            performance.now();



        function animate(time) {

            const progress =
                Math.min(
                    (time - start) /
                    duration,
                    1
                );



            current =
                number * progress;



            let display;



            if (
                original.includes(".")
            ) {

                display =
                    current.toFixed(1);

            } else {

                display =
                    Math.floor(
                        current
                    ).toLocaleString();

            }



            element.textContent =
                display +
                suffix;



            if (
                progress < 1
            ) {

                requestAnimationFrame(
                    animate
                );

            } else {

                element.textContent =
                    original;

            }

        }



        requestAnimationFrame(
            animate
        );

    });



    /* ======================================================
       11. ISSUE CARD HOVER
    ====================================================== */

    issueCards.forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.style.transform =
                    "translateY(-4px)";

                card.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.12)";

                card.style.transition =
                    "all 0.2s ease";

            }
        );



        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "translateY(0)";

                card.style.boxShadow =
                    "";

            }
        );

    });



    /* ======================================================
       12. KEYBOARD SHORTCUTS
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
               "/" = search
            */

            if (
                event.key === "/" &&
                document.activeElement.tagName !== "INPUT"
            ) {

                event.preventDefault();

                const search =
                    document.querySelector(
                        "#issueSearch"
                    );

                if (search) {
                    search.focus();
                }

            }



            /*
               Escape = close modal/menu
            */

            if (
                event.key === "Escape"
            ) {

                const modal =
                    document.querySelector(
                        ".ns-modal-overlay"
                    );

                if (modal) {
                    modal.remove();
                }



                const profile =
                    document.querySelector(
                        ".js-profile-menu"
                    );

                if (profile) {
                    profile.remove();
                }

            }

        }
    );



    /* ======================================================
       13. SCROLL REVEAL
    ====================================================== */

    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.15
                }
            );



        issueCards.forEach(card => {

            card.style.opacity =
                "0";

            card.style.transform =
                "translateY(20px)";

            card.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

            observer.observe(
                card
            );

        });

    }



    /* ======================================================
       14. OFFLINE / ONLINE
    ====================================================== */

    window.addEventListener(
        "online",
        () => {

            showToast(
                "You are back online."
            );

        }
    );



    window.addEventListener(
        "offline",
        () => {

            showToast(
                "You are offline.",
                "error"
            );

        }
    );



    /* ======================================================
       15. FINAL MESSAGE
    ====================================================== */

    console.log(
        "================================"
    );

    console.log(
        "NAGRIK SETU FRONTEND ACTIVE"
    );

    console.log(
        "✓ DOM manipulation"
    );

    console.log(
        "✓ Event handling"
    );

    console.log(
        "✓ Search"
    );

    console.log(
        "✓ Filters"
    );

    console.log(
        "✓ Issue modal"
    );

    console.log(
        "✓ Profile menu"
    );

    console.log(
        "✓ Save issues"
    );

    console.log(
        "✓ LocalStorage"
    );

    console.log(
        "✓ Keyboard shortcuts"
    );

    console.log(
        "✓ Animations"
    );

    console.log(
        "================================"
    );

});



async function submitComplaint() {

    const complaint = {
        name: "Rupesh",
        category: "Road",
        description: "Road has potholes",
        location: "Gurugram"
    };

    try {

        const response = await fetch("/api/complaints", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(complaint)
        });

        const data = await response.json();

        console.log(data);

        alert("Complaint submitted successfully!");

    } catch (error) {

        console.error("Error:", error);
        alert("Failed to submit complaint.");

    }
}