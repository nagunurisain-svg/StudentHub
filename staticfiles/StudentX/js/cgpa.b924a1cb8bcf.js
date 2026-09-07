document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("semesterContainer");

    const addButton = document.getElementById("addSemester");

    const calculateButton =
        document.getElementById("calculateCgpa");

    const resetButton =
        document.getElementById("resetCalculator");

    const result =
        document.getElementById("cgpaResult");

    const totalCredits =
        document.getElementById("totalCredits");

    const weightedPoints =
        document.getElementById("weightedPoints");

    const percentageResult =
        document.getElementById("percentageResult");

    const errorMessage =
        document.getElementById("errorMessage");


    let semesterNumber = 1;


    /* =========================
       ADD SEMESTER
    ========================= */

    addButton.addEventListener("click", function () {

        semesterNumber++;

        const row = document.createElement("div");

        row.className = "semester-row";

        row.innerHTML = `
            <div class="input-group">
                <label>Semester</label>

                <input
                    type="text"
                    class="semester-number"
                    value="${semesterNumber}"
                    readonly
                >
            </div>

            <div class="input-group">
                <label>SGPA</label>

                <input
                    type="number"
                    class="sgpa"
                    placeholder="Example: 8.25"
                    min="0"
                    max="10"
                    step="0.01"
                >
            </div>

            <div class="input-group">
                <label>Credits</label>

                <input
                    type="number"
                    class="credits"
                    placeholder="Example: 20"
                    min="0"
                    step="0.1"
                >
            </div>

            <button
                type="button"
                class="remove-semester"
                title="Remove semester"
            >
                ×
            </button>
        `;

        container.appendChild(row);

        attachRemoveButton(
            row.querySelector(".remove-semester")
        );

    });


    /* =========================
       REMOVE SEMESTER
    ========================= */

    function attachRemoveButton(button) {

        button.addEventListener("click", function () {

            const rows =
                container.querySelectorAll(".semester-row");

            if (rows.length <= 1) {

                showError(
                    "At least one semester is required."
                );

                return;
            }

            button.closest(".semester-row").remove();

            renumberSemesters();

        });

    }


    function renumberSemesters() {

        const rows =
            container.querySelectorAll(".semester-row");

        rows.forEach(function (row, index) {

            row.querySelector(".semester-number").value =
                index + 1;

        });

        semesterNumber = rows.length;

    }


    /* =========================
       CALCULATE
    ========================= */

    calculateButton.addEventListener(
        "click",
        function () {

            const rows =
                container.querySelectorAll(".semester-row");

            let weightedSum = 0;

            let creditsSum = 0;


            hideError();


            for (let row of rows) {

                const sgpa =
                    parseFloat(
                        row.querySelector(".sgpa").value
                    );

                const credits =
                    parseFloat(
                        row.querySelector(".credits").value
                    );


                if (
                    isNaN(sgpa) ||
                    sgpa < 0 ||
                    sgpa > 10
                ) {

                    showError(
                        "Please enter a valid SGPA between 0 and 10."
                    );

                    return;
                }


                if (
                    isNaN(credits) ||
                    credits <= 0
                ) {

                    showError(
                        "Please enter valid credits greater than 0."
                    );

                    return;
                }


                weightedSum += sgpa * credits;

                creditsSum += credits;

            }


            if (creditsSum <= 0) {

                showError(
                    "Please enter your semester details."
                );

                return;
            }


            const cgpa =
                weightedSum / creditsSum;

            const percentage =
                cgpa * 10;


            result.textContent =
                cgpa.toFixed(2);

            totalCredits.textContent =
                creditsSum.toFixed(1);

            weightedPoints.textContent =
                weightedSum.toFixed(2);

            percentageResult.textContent =
                percentage.toFixed(2) + "%";


            /* =========================
               RECORD TOOL USAGE
            ========================= */

            fetch("/record-tool-usage/", {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",

                    "X-CSRFToken":
                        getCookie("csrftoken")
                },

                body:
                    "tool_name=CGPA%20Calculator"
            });

        }
    );


    /* =========================
       RESET
    ========================= */

    resetButton.addEventListener(
        "click",
        function () {

            container.innerHTML = `
                <div class="semester-row">

                    <div class="input-group">
                        <label>Semester</label>

                        <input
                            type="text"
                            class="semester-number"
                            value="1"
                            readonly
                        >
                    </div>

                    <div class="input-group">
                        <label>SGPA</label>

                        <input
                            type="number"
                            class="sgpa"
                            placeholder="Example: 8.25"
                            min="0"
                            max="10"
                            step="0.01"
                        >
                    </div>

                    <div class="input-group">
                        <label>Credits</label>

                        <input
                            type="number"
                            class="credits"
                            placeholder="Example: 20"
                            min="0"
                            step="0.1"
                        >
                    </div>

                    <button
                        type="button"
                        class="remove-semester"
                        title="Remove semester"
                    >
                        ×
                    </button>

                </div>
            `;


            semesterNumber = 1;


            attachRemoveButton(
                container.querySelector(".remove-semester")
            );


            result.textContent = "0.00";

            totalCredits.textContent = "0";

            weightedPoints.textContent = "0.00";

            percentageResult.textContent = "0.00%";

            hideError();

        }
    );


    /* =========================
       ERROR HELPERS
    ========================= */

    function showError(message) {

        errorMessage.textContent = message;

        errorMessage.style.display = "block";

    }


    function hideError() {

        errorMessage.textContent = "";

        errorMessage.style.display = "none";

    }


    /* =========================
       GET CSRF COOKIE
    ========================= */

    function getCookie(name) {

        let cookieValue = null;

        if (
            document.cookie &&
            document.cookie !== ""
        ) {

            const cookies =
                document.cookie.split(";");


            for (let cookie of cookies) {

                cookie = cookie.trim();


                if (
                    cookie.startsWith(name + "=")
                ) {

                    cookieValue =
                        decodeURIComponent(
                            cookie.substring(
                                name.length + 1
                            )
                        );

                    break;
                }

            }

        }

        return cookieValue;

    }


    /* =========================
       INITIAL REMOVE BUTTON
    ========================= */

    attachRemoveButton(
        document.querySelector(".remove-semester")
    );

});