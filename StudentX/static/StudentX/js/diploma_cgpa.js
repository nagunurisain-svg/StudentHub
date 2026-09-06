let semesterNumber = 1;


/* ==========================================
   ADD SEMESTER
   ========================================== */

function addSemester() {

    semesterNumber++;

    const semesterList =
        document.getElementById("semesterList");

    const row = document.createElement("div");

    row.className = "semester-row";

    row.innerHTML = `
        <div class="input-group">

            <label>Semester</label>

            <input
                type="text"
                value="${semesterNumber}"
                class="semester-name"
                readonly
            >

        </div>

        <div class="input-group">

            <label>SGPA</label>

            <input
                type="number"
                class="sgpa-input"
                placeholder="0.00"
                min="0"
                max="10"
                step="0.01"
            >

        </div>

        <div class="input-group">

            <label>Credits</label>

            <input
                type="number"
                class="credits-input"
                placeholder="0"
                min="0"
                step="0.01"
            >

        </div>

        <button
            type="button"
            class="remove-semester"
            onclick="removeSemester(this)">
            ×
        </button>
    `;

    semesterList.appendChild(row);
}


/* ==========================================
   REMOVE SEMESTER
   ========================================== */

function removeSemester(button) {

    const rows =
        document.querySelectorAll(".semester-row");

    if (rows.length === 1) {

        showError(
            "At least one semester is required."
        );

        return;
    }

    button.parentElement.remove();

    updateSemesterNumbers();
}


/* ==========================================
   UPDATE SEMESTER NUMBERS
   ========================================== */

function updateSemesterNumbers() {

    const rows =
        document.querySelectorAll(".semester-row");

    rows.forEach((row, index) => {

        row.querySelector(".semester-name").value =
            index + 1;

    });

    semesterNumber = rows.length;
}


/* ==========================================
   CALCULATE DIPLOMA CGPA
   ========================================== */

function calculateDiplomaCGPA() {

    const rows =
        document.querySelectorAll(".semester-row");

    let totalCredits = 0;
    let totalPoints = 0;

    hideError();

    for (let row of rows) {

        const sgpaInput =
            row.querySelector(".sgpa-input");

        const creditsInput =
            row.querySelector(".credits-input");

        const sgpa =
            parseFloat(sgpaInput.value);

        const credits =
            parseFloat(creditsInput.value);


        /* Empty fields */

        if (isNaN(sgpa) || isNaN(credits)) {

            showError(
                "Please enter SGPA and credits for every semester."
            );

            return;
        }


        /* SGPA validation */

        if (sgpa < 0 || sgpa > 10) {

            showError(
                "SGPA must be between 0 and 10."
            );

            return;
        }


        /* Credit validation */

        if (credits <= 0) {

            showError(
                "Credits must be greater than 0."
            );

            return;
        }


        /* Calculation */

        totalCredits += credits;

        totalPoints += sgpa * credits;
    }


    /* Prevent division by zero */

    if (totalCredits === 0) {

        showError(
            "Please enter valid credits."
        );

        return;
    }


    /* Final CGPA */

    const cgpa =
        totalPoints / totalCredits;


    /* General percentage reference */

    const percentage =
        cgpa * 10;


    /* Display results */

    document.getElementById("cgpaResult").textContent =
        cgpa.toFixed(2);

    document.getElementById("creditsResult").textContent =
        totalCredits.toFixed(2);

    document.getElementById("pointsResult").textContent =
        totalPoints.toFixed(2);

    document.getElementById("percentageResult").textContent =
        percentage.toFixed(2) + "%";


    document.getElementById("results").style.display =
        "block";
}


/* ==========================================
   RESET
   ========================================== */

function resetCalculator() {

    const semesterList =
        document.getElementById("semesterList");

    semesterList.innerHTML = `
        <div class="semester-row">

            <div class="input-group">

                <label>Semester</label>

                <input
                    type="text"
                    value="1"
                    class="semester-name"
                    readonly
                >

            </div>

            <div class="input-group">

                <label>SGPA</label>

                <input
                    type="number"
                    class="sgpa-input"
                    placeholder="0.00"
                    min="0"
                    max="10"
                    step="0.01"
                >

            </div>

            <div class="input-group">

                <label>Credits</label>

                <input
                    type="number"
                    class="credits-input"
                    placeholder="0"
                    min="0"
                    step="0.01"
                >

            </div>

            <button
                type="button"
                class="remove-semester"
                onclick="removeSemester(this)">
                ×
            </button>

        </div>
    `;


    semesterNumber = 1;

    hideError();

    document.getElementById("results").style.display =
        "none";
}


/* ==========================================
   SHOW ERROR
   ========================================== */

function showError(message) {

    const error =
        document.getElementById("errorMessage");

    error.textContent = message;

    error.style.display = "block";
}


/* ==========================================
   HIDE ERROR
   ========================================== */

function hideError() {

    document.getElementById("errorMessage").style.display =
        "none";
}