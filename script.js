/* =========================================================
   NAGRIK SETU - FRONTEND INTERACTIVE JAVASCRIPT
   DOM Manipulation + Event Handling + LocalStorage
   No Backend Required
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Nagrik Setu JavaScript Loaded");

    /* =====================================================
       1. SELECT DOM ELEMENTS
    ===================================================== */

    const filterButtons = document.querySelectorAll(".filter");
    const issueCards = document.querySelectorAll(".issue-card");

    const reportButtons = document.querySelectorAll(
        ".report-button, .nearby-report-button"
    );

    const navLinks = document.querySelectorAll(".site-nav a");

    const profile = document.querySelector(".profile-circle");

    const howCard = document.querySelector(".how-card");

    const issueGrid = document.querySelector(".issue-grid");

    const searchInput = document.querySelector(".search");



    /* =====================================================
       2. CREATE TOAST NOTIFICATION
    ===================================================== */

    function showToast(message, type = "success") {

        const oldToast = document.querySelector(".ns-toast");

        if (oldToast) {
            oldToast.remove();
        }

        const toast = document.createElement("div");

        toast.className = "ns-toast";

        toast.textContent = message;

        toast.style.position = "fixed";
        toast.style.bottom = "25px";
        toast.style.right = "25px";
        toast.style.padding = "14px 22px";
        toast.style.background =
            type === "error" ? "#dc2626" : "#111827";

        toast.style.color = "white";
        toast.style.borderRadius = "10px";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "600";
        toast.style.zIndex = "99999";
        toast.style.boxShadow = "0 8px 30px rgba(0,0,0,0.25)";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        toast.style.transition = "all 0.3s ease";

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        }, 10);

        setTimeout(() => {

            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";

            setTimeout(() => {
                toast.remove();
            }, 300);

        }, 3000);
    }



    /* =====================================================
       3. FILTER ISSUES
    ===================================================== */

    filterButtons.forEach(button => {

        button.addEventListener("click", function () {

            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            // Add active class to clicked button
            this.classList.add("active");

            const selectedCategory =
                this.textContent.trim().toLowerCase();

            let visibleCount = 0;

            issueCards.forEach(card => {

                const categoryElement =
                    card.querySelector(".issue-meta");

                const titleElement =
                    card.querySelector(".issue-title");

                if (!categoryElement && !titleElement) {
                    return;
                }

                const cardText =
                    card.textContent.toLowerCase();

                let showCard = false;

                if (selectedCategory === "all") {
                    showCard = true;
                }
                else {
                    showCard =
                        cardText.includes(selectedCategory);
                }

                if (showCard) {

                    card.style.display = "";

                    visibleCount++;

                    card.style.opacity = "0";

                    setTimeout(() => {
                        card.style.transition =
                            "opacity 0.3s ease";

                        card.style.opacity = "1";
                    }, 50);

                }
                else {

                    card.style.display = "none";

                }

            });

            localStorage.setItem(
                "selectedIssueFilter",
                selectedCategory
            );

            showToast(
                `${selectedCategory.toUpperCase()} issues: ${visibleCount}`
            );
        });

    });



    /* =====================================================
       4. RESTORE LAST SELECTED FILTER
    ===================================================== */

    const savedFilter =
        localStorage.getItem("selectedIssueFilter");

    if (savedFilter) {

        filterButtons.forEach(button => {

            if (
                button.textContent.trim().toLowerCase()
                === savedFilter
            ) {
                button.click();
            }

        });

    }



    /* =====================================================
       5. LIVE SEARCH
    ===================================================== */

    let dynamicSearch = searchInput;

    /*
       If your current HTML does not have an input with
       class="search", create one.
    */

    if (!dynamicSearch) {

        const searchContainer =
            document.querySelector(".search");

        if (searchContainer &&
            searchContainer.tagName !== "INPUT") {

            dynamicSearch =
                document.createElement("input");

            dynamicSearch.type = "text";
            dynamicSearch.placeholder =
                "Search issues...";
            dynamicSearch.className =
                "dynamic-search";

            dynamicSearch.style.padding = "10px";
            dynamicSearch.style.border =
                "1px solid #ddd";
            dynamicSearch.style.borderRadius =
                "8px";

            searchContainer.appendChild(dynamicSearch);
        }
    }



    /* =====================================================
       6. SEARCH ISSUE CARDS
    ===================================================== */

    if (
        dynamicSearch &&
        dynamicSearch.tagName === "INPUT"
    ) {

        dynamicSearch.addEventListener(
            "input",
            function () {

                const searchValue =
                    this.value.toLowerCase().trim();

                issueCards.forEach(card => {

                    const cardText =
                        card.textContent.toLowerCase();

                    if (
                        cardText.includes(searchValue)
                    ) {

                        card.style.display = "";

                    }
                    else {

                        card.style.display = "none";

                    }

                });

            }
        );

    }



    /* =====================================================
       7. REPORT ISSUE BUTTON
    ===================================================== */

    reportButtons.forEach(button => {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            window.location.href =
                "report-issue.html";

        });

    });



    /* =====================================================
       8. VIEW ISSUE BUTTONS
    ===================================================== */

    const viewIssueLinks =
        document.querySelectorAll(
            ".issue-card a"
        );

    viewIssueLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const card =
                this.closest(".issue-card");

            if (!card) return;

            openIssueModal(card);

        });

    });



    /* =====================================================
       9. CREATE ISSUE MODAL
    ===================================================== */

    function openIssueModal(card) {

        const title =
            card.querySelector(".issue-title")?.textContent
            || "Unknown Issue";

        const location =
            card.querySelector(".issue-location")?.textContent
            || "Location unavailable";

        const description =
            card.querySelector(".issue-meta")?.textContent
            || "Issue reported by a citizen.";

        const status =
            card.querySelector(".issue-status")?.textContent
            || "Reported";

        const priority =
            card.querySelector(".issue-priority")?.textContent
            || "Normal";

        const affected =
            card.querySelector(".affected-count")
                ?.textContent
            || "0";

        const updates =
            card.querySelector(".updates-count")
                ?.textContent
            || "0";



        // Create overlay
        const overlay =
            document.createElement("div");

        overlay.className =
            "issue-modal-overlay";

        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background =
            "rgba(0,0,0,0.6)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "10000";
        overlay.style.padding = "20px";



        // Create modal
        const modal =
            document.createElement("div");

        modal.style.background = "white";
        modal.style.maxWidth = "600px";
        modal.style.width = "100%";
        modal.style.maxHeight = "90vh";
        modal.style.overflowY = "auto";
        modal.style.borderRadius = "16px";
        modal.style.padding = "28px";
        modal.style.position = "relative";
        modal.style.boxShadow =
            "0 20px 60px rgba(0,0,0,0.3)";



        modal.innerHTML = `

            <button id="closeIssueModal"
                style="
                    position:absolute;
                    right:18px;
                    top:15px;
                    border:none;
                    background:none;
                    font-size:25px;
                    cursor:pointer;
                ">
                ×
            </button>

            <h2 style="margin-bottom:10px;">
                ${title}
            </h2>

            <p style="
                color:#6b7280;
                margin-bottom:20px;
            ">
                ${location}
            </p>

            <div style="
                display:flex;
                gap:10px;
                flex-wrap:wrap;
                margin-bottom:20px;
            ">

                <span style="
                    background:#fef3c7;
                    padding:7px 12px;
                    border-radius:20px;
                    font-size:13px;
                ">
                    ${priority}
                </span>

                <span style="
                    background:#dcfce7;
                    padding:7px 12px;
                    border-radius:20px;
                    font-size:13px;
                ">
                    ${status}
                </span>

            </div>

            <h3>Issue Information</h3>

            <p style="margin-top:8px;">
                ${description}
            </p>

            <hr style="margin:25px 0;">

            <div style="
                display:flex;
                justify-content:space-between;
                gap:20px;
            ">

                <div>
                    <strong>${affected}</strong>
                    <br>
                    <small>People affected</small>
                </div>

                <div>
                    <strong>${updates}</strong>
                    <br>
                    <small>Updates</small>
                </div>

            </div>

            <hr style="margin:25px 0;">

            <h3>Issue Progress</h3>

            <div style="margin-top:15px;">

                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    margin-bottom:12px;
                ">
                    <span>●</span>
                    <span>Issue Reported</span>
                </div>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    margin-bottom:12px;
                ">
                    <span>●</span>
                    <span>Authority Notified</span>
                </div>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    margin-bottom:12px;
                ">
                    <span>●</span>
                    <span>Inspection</span>
                </div>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    margin-bottom:12px;
                ">
                    <span>●</span>
                    <span>Work Started</span>
                </div>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                ">
                    <span>●</span>
                    <span>Resolved</span>
                </div>

            </div>

            <button id="affectedButton"
                style="
                    width:100%;
                    margin-top:25px;
                    padding:12px;
                    border:none;
                    border-radius:8px;
                    background:#111827;
                    color:white;
                    cursor:pointer;
                    font-weight:600;
                ">
                This affects me
            </button>

        `;

        overlay.appendChild(modal);

        document.body.appendChild(overlay);



        /* CLOSE MODAL */

        document
            .getElementById("closeIssueModal")
            .addEventListener("click", function () {

                overlay.remove();

            });



        /* CLOSE WHEN CLICKING OUTSIDE */

        overlay.addEventListener(
            "click",
            function (event) {

                if (event.target === overlay) {
                    overlay.remove();
                }

            }
        );



        /* ESC KEY */

        document.addEventListener(
            "keydown",
            function closeOnEscape(event) {

                if (event.key === "Escape") {

                    overlay.remove();

                    document.removeEventListener(
                        "keydown",
                        closeOnEscape
                    );

                }

            }
        );



        /* AFFECTED BUTTON */

        const affectedButton =
            document.getElementById(
                "affectedButton"
            );

        affectedButton.addEventListener(
            "click",
            function () {

                const issueTitle =
                    title;

                const key =
                    "affected_" + issueTitle;

                const alreadyVoted =
                    localStorage.getItem(key);

                if (alreadyVoted) {

                    showToast(
                        "You already marked this issue.",
                        "error"
                    );

                    return;
                }

                localStorage.setItem(
                    key,
                    "true"
                );

                affectedButton.textContent =
                    "✓ Marked as affecting you";

                affectedButton.style.background =
                    "#16a34a";

                showToast(
                    "Your impact has been recorded."
                );

            }
        );

    }



    /* =====================================================
       10. PROFILE BUTTON
    ===================================================== */

    if (profile) {

        profile.style.cursor = "pointer";

        profile.addEventListener(
            "click",
            function () {

                openProfileMenu();

            }
        );

    }



    /* =====================================================
       11. PROFILE DROPDOWN
    ===================================================== */

    function openProfileMenu() {

        const existing =
            document.querySelector(
                ".profile-dropdown"
            );

        if (existing) {

            existing.remove();

            return;

        }



        const menu =
            document.createElement("div");

        menu.className =
            "profile-dropdown";

        menu.style.position =
            "fixed";

        menu.style.top =
            "75px";

        menu.style.right =
            "25px";

        menu.style.width =
            "230px";

        menu.style.background =
            "white";

        menu.style.borderRadius =
            "12px";

        menu.style.padding =
            "15px";

        menu.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.15)";

        menu.style.zIndex =
            "9999";



        menu.innerHTML = `

            <div style="
                padding:10px;
                border-bottom:1px solid #eee;
            ">

                <strong>Rupesh</strong>

                <br>

                <small style="color:#777;">
                    Citizen Account
                </small>

            </div>

            <button id="myReports"
                style="
                    width:100%;
                    padding:10px;
                    margin-top:8px;
                    border:none;
                    background:none;
                    text-align:left;
                    cursor:pointer;
                ">
                📋 My Reports
            </button>

            <button id="savedIssues"
                style="
                    width:100%;
                    padding:10px;
                    border:none;
                    background:none;
                    text-align:left;
                    cursor:pointer;
                ">
                ⭐ Saved Issues
            </button>

            <button id="logoutButton"
                style="
                    width:100%;
                    padding:10px;
                    border:none;
                    background:none;
                    text-align:left;
                    cursor:pointer;
                ">
                🚪 Logout
            </button>

        `;

        document.body.appendChild(menu);



        document
            .getElementById("myReports")
            .addEventListener(
                "click",
                function () {

                    showToast(
                        "My Reports feature opened."
                    );

                }
            );



        document
            .getElementById("savedIssues")
            .addEventListener(
                "click",
                function () {

                    showToast(
                        "Saved issues opened."
                    );

                }
            );



        document
            .getElementById("logoutButton")
            .addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "nagrikUser"
                    );

                    showToast(
                        "Logged out successfully."
                    );

                    menu.remove();

                }
            );

    }



    /* =====================================================
       12. ACTIVE NAVIGATION
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();



    navLinks.forEach(link => {

        const linkPage =
            link.getAttribute("href");

        if (!linkPage) return;

        const cleanPage =
            linkPage.split("#")[0]
                .toLowerCase();

        if (
            cleanPage === currentPage
        ) {

            link.classList.add("active");

        }

    });



    /* =====================================================
       13. HOW DOES NAGRIK SETU WORK
    ===================================================== */

    if (howCard) {

        howCard.style.cursor = "pointer";

        howCard.addEventListener(
            "click",
            function () {

                showHowNagrikSetuWorks();

            }
        );

    }



    function showHowNagrikSetuWorks() {

        const overlay =
            document.createElement("div");

        overlay.style.position =
            "fixed";

        overlay.style.inset =
            "0";

        overlay.style.background =
            "rgba(0,0,0,0.6)";

        overlay.style.display =
            "flex";

        overlay.style.alignItems =
            "center";

        overlay.style.justifyContent =
            "center";

        overlay.style.zIndex =
            "10000";



        const modal =
            document.createElement("div");

        modal.style.background =
            "white";

        modal.style.width =
            "90%";

        modal.style.maxWidth =
            "550px";

        modal.style.padding =
            "30px";

        modal.style.borderRadius =
            "16px";



        modal.innerHTML = `

            <h2>
                How does Nagrik Setu work?
            </h2>

            <br>

            <div>

                <p>
                    📝 <strong>1. Report</strong>
                </p>

                <p>
                    Citizens report civic problems
                    in their locality.
                </p>

                <br>

                <p>
                    📍 <strong>2. Track</strong>
                </p>

                <p>
                    Track the progress of your
                    reported issue.
                </p>

                <br>

                <p>
                    🏛️ <strong>3. Authority Response</strong>
                </p>

                <p>
                    Relevant authorities can
                    acknowledge and process issues.
                </p>

                <br>

                <p>
                    ✅ <strong>4. Resolution</strong>
                </p>

                <p>
                    Citizens can see when the
                    issue has been resolved.
                </p>

            </div>

            <button id="closeHow"
                style="
                    margin-top:20px;
                    width:100%;
                    padding:12px;
                    border:none;
                    border-radius:8px;
                    background:#111827;
                    color:white;
                    cursor:pointer;
                ">
                Close
            </button>

        `;

        overlay.appendChild(modal);

        document.body.appendChild(overlay);



        document
            .getElementById("closeHow")
            .addEventListener(
                "click",
                () => overlay.remove()
            );



        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === overlay
                ) {
                    overlay.remove();
                }

            }
        );

    }



    /* =====================================================
       14. FOOTER LINK HANDLING
    ===================================================== */

    const footerLinks =
        document.querySelectorAll(
            "footer a"
        );

    footerLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (
            href === "#" ||
            href === "" ||
            href === null
        ) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const text =
                        this.textContent.trim();

                    showToast(
                        `${text} page coming soon.`
                    );

                }
            );

        }

    });



    /* =====================================================
       15. KEYBOARD SHORTCUT
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            /*
             Press "/" to focus search
            */

            if (
                event.key === "/" &&
                document.activeElement.tagName !== "INPUT"
            ) {

                event.preventDefault();

                if (dynamicSearch) {

                    dynamicSearch.focus();

                }

            }



            /*
             Press Escape to clear search
            */

            if (
                event.key === "Escape" &&
                dynamicSearch
            ) {

                dynamicSearch.value = "";

                issueCards.forEach(card => {
                    card.style.display = "";
                });

            }

        }
    );



    /* =====================================================
       16. ANIMATED STATISTICS
    ===================================================== */

    const statNumbers =
        document.querySelectorAll(
            ".stat-number"
        );



    function animateNumber(element) {

        const original =
            element.textContent.trim();

        const numericValue =
            parseFloat(
                original.replace(/,/g, "")
            );

        if (isNaN(numericValue)) {
            return;
        }

        const hasDecimal =
            original.includes(".");

        const duration =
            1200;

        const start =
            performance.now();



        function update(currentTime) {

            const progress =
                Math.min(
                    (currentTime - start)
                    / duration,
                    1
                );

            const currentValue =
                numericValue * progress;



            if (hasDecimal) {

                element.textContent =
                    currentValue.toFixed(1);

            }
            else {

                element.textContent =
                    Math.floor(
                        currentValue
                    ).toLocaleString();

            }



            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            }
            else {

                element.textContent =
                    original;

            }

        }

        requestAnimationFrame(update);

    }



    statNumbers.forEach(
        animateNumber
    );



    /* =====================================================
       17. ISSUE CARD HOVER EFFECT
    ===================================================== */

    issueCards.forEach(card => {

        card.addEventListener(
            "mouseenter",
            function () {

                this.style.transform =
                    "translateY(-5px)";

                this.style.transition =
                    "transform 0.2s ease, box-shadow 0.2s ease";

                this.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.12)";

            }
        );



        card.addEventListener(
            "mouseleave",
            function () {

                this.style.transform =
                    "translateY(0)";

                this.style.boxShadow =
                    "";

            }
        );

    });



    /* =====================================================
       18. SAVE / BOOKMARK ISSUE
    ===================================================== */

    issueCards.forEach((card, index) => {

        const title =
            card.querySelector(
                ".issue-title"
            )?.textContent
            || `Issue ${index + 1}`;



        const saveButton =
            document.createElement("button");

        saveButton.textContent =
            "☆";

        saveButton.title =
            "Save issue";

        saveButton.style.position =
            "absolute";

        saveButton.style.top =
            "12px";

        saveButton.style.right =
            "12px";

        saveButton.style.width =
            "36px";

        saveButton.style.height =
            "36px";

        saveButton.style.border =
            "none";

        saveButton.style.borderRadius =
            "50%";

        saveButton.style.background =
            "white";

        saveButton.style.fontSize =
            "20px";

        saveButton.style.cursor =
            "pointer";

        saveButton.style.zIndex =
            "5";



        /*
           Make sure card can contain
           absolutely positioned button
        */

        if (
            getComputedStyle(card).position
            === "static"
        ) {

            card.style.position =
                "relative";

        }



        card.appendChild(
            saveButton
        );



        const saveKey =
            "saved_" + title;



        if (
            localStorage.getItem(
                saveKey
            )
        ) {

            saveButton.textContent =
                "★";

        }



        saveButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();



                const saved =
                    localStorage.getItem(
                        saveKey
                    );



                if (saved) {

                    localStorage.removeItem(
                        saveKey
                    );

                    this.textContent =
                        "☆";

                    showToast(
                        "Issue removed from saved."
                    );

                }
                else {

                    localStorage.setItem(
                        saveKey,
                        "true"
                    );

                    this.textContent =
                        "★";

                    showToast(
                        "Issue saved."
                    );

                }

            }
        );

    });



    /* =====================================================
       19. ISSUE CARD CLICK
    ===================================================== */

    issueCards.forEach(card => {

        card.addEventListener(
            "click",
            function (event) {

                /*
                   Don't open modal when
                   clicking buttons/links
                */

                if (
                    event.target.closest("a") ||
                    event.target.closest("button")
                ) {
                    return;
                }

                openIssueModal(
                    this
                );

            }
        );

    });



    /* =====================================================
       20. LOCAL STORAGE USER
    ===================================================== */

    if (
        !localStorage.getItem(
            "nagrikUser"
        )
    ) {

        const user = {

            name: "Rupesh",

            role: "Citizen",

            loginTime:
                new Date()
                    .toISOString()

        };

        localStorage.setItem(
            "nagrikUser",
            JSON.stringify(user)
        );

    }



    /* =====================================================
       21. SCROLL REVEAL ANIMATION
    ===================================================== */

    const elementsToReveal =
        document.querySelectorAll(
            ".issue-card, .sidebar-card, .how-card"
        );



    elementsToReveal.forEach(
        element => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(20px)";

            element.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

        }
    );



    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );



    elementsToReveal.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );



    /* =====================================================
       22. DYNAMIC LAST UPDATED
    ===================================================== */

    const lastUpdated =
        document.createElement("div");

    lastUpdated.textContent =
        "Last updated just now";

    lastUpdated.style.position =
        "fixed";

    lastUpdated.style.bottom =
        "10px";

    lastUpdated.style.left =
        "10px";

    lastUpdated.style.fontSize =
        "11px";

    lastUpdated.style.color =
        "#777";

    lastUpdated.style.background =
        "rgba(255,255,255,0.9)";

    lastUpdated.style.padding =
        "5px 8px";

    lastUpdated.style.borderRadius =
        "5px";

    lastUpdated.style.zIndex =
        "1000";

    document.body.appendChild(
        lastUpdated
    );



    /* =====================================================
       23. UPDATE TIME
    ===================================================== */

    setInterval(
        function () {

            lastUpdated.textContent =
                "Last updated just now";

        },
        60000
    );



    /* =====================================================
       24. ONLINE / OFFLINE DETECTION
    ===================================================== */

    window.addEventListener(
        "online",
        function () {

            showToast(
                "You are back online."
            );

        }
    );



    window.addEventListener(
        "offline",
        function () {

            showToast(
                "You are offline. Some features may not work.",
                "error"
            );

        }
    );



    /* =====================================================
       25. CONSOLE MESSAGE
    ===================================================== */

    console.log(
        "================================="
    );

    console.log(
        "NAGRIK SETU FRONTEND ACTIVE"
    );

    console.log(
        "DOM manipulation: ENABLED"
    );

    console.log(
        "Event handling: ENABLED"
    );

    console.log(
        "LocalStorage: ENABLED"
    );

    console.log(
        "Backend: NOT REQUIRED"
    );

    console.log(
        "================================="
    );

});