document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       MOBILE MENU
    ========================= */

    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");

    if (menuBtn && navMenu) {

        menuBtn.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });

        navMenu.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
            });

        });
    }


    /* =========================
       TOOL SEARCH
    ========================= */

    const searchInput = document.getElementById("toolSearch");
    const toolCards = document.querySelectorAll(".tool-card");
    const noResults = document.getElementById("noResults");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchValue = searchInput.value
                .toLowerCase()
                .trim();

            let visibleCards = 0;

            toolCards.forEach(function (card) {

                const toolName = card
                    .getAttribute("data-name")
                    .toLowerCase();

                if (toolName.includes(searchValue)) {

                    card.style.display = "";

                    visibleCards++;

                } else {

                    card.style.display = "none";

                }

            });


            if (visibleCards === 0 && searchValue !== "") {

                noResults.style.display = "block";

            } else {

                noResults.style.display = "none";

            }

        });

    }

});