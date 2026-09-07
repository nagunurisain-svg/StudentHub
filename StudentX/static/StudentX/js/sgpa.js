document.addEventListener("DOMContentLoaded", function () {

const container =
    document.getElementById("subjectContainer");

const addButton =
    document.getElementById("addSubject");

const calculateButton =
    document.getElementById("calculateSgpa");

const resetButton =
    document.getElementById("resetCalculator");

const result =
    document.getElementById("sgpaResult");

const totalCredits =
    document.getElementById("totalCredits");

const totalPoints =
    document.getElementById("totalPoints");

const percentageResult =
    document.getElementById("percentageResult");

const errorMessage =
    document.getElementById("errorMessage");


let subjectNumber = 1;


/* =========================
   UPDATE GRADE POINT
========================= */

function updateGradePoint(row) {

    const grade =
        row.querySelector(".subject-grade").value;

    const gradePoint =
        row.querySelector(".grade-point");


    if (grade === "") {

        gradePoint.value = "-";

    } else {

        gradePoint.value =
            Number(grade).toFixed(0);

    }

}


/* =========================
   ADD SUBJECT
========================= */

addButton.addEventListener("click", function () {

    subjectNumber++;

    const row =
        document.createElement("div");

    row.className = "subject-row";

    row.innerHTML = `

        <input
            type="text"
            class="subject-name"
            value="Subject ${subjectNumber}"
            placeholder="Subject name"
        >

        <input
            type="number"
            class="subject-credit"
            placeholder="Credits"
            min="0"
            step="0.5"
        >

        <select class="subject-grade">

            <option value="">Select</option>
            <option value="10">O</option>
            <option value="9">A+</option>
            <option value="8">A</option>
            <option value="7">B+</option>
            <option value="6">B</option>
            <option value="5">C</option>
            <option value="4">P</option>
            <option value="0">F</option>

        </select>

        <input
            type="text"
            class="grade-point"
            value="-"
            readonly
        >

        <button
            type="button"
            class="remove-subject"
        >
            ×
        </button>
    `;


    container.appendChild(row);


    row.querySelector(".subject-grade")
        .addEventListener(
            "change",
            function () {
                updateGradePoint(row);
            }
        );


    attachRemoveButton(
        row.querySelector(".remove-subject")
    );

});


/* =========================
   REMOVE SUBJECT
========================= */

function attachRemoveButton(button) {

    button.addEventListener("click", function () {

        const rows =
            container.querySelectorAll(".subject-row");


        if (rows.length <= 1) {

            showError(
                "At least one subject is required."
            );

            return;
        }


        button.closest(".subject-row").remove();

        renumberSubjects();

    });

}


function renumberSubjects() {

    const rows =
        container.querySelectorAll(".subject-row");


    rows.forEach(function (row, index) {

        const name =
            row.querySelector(".subject-name");

        name.value =
            "Subject " + (index + 1);

    });


    subjectNumber = rows.length;

}


/* =========================
   CALCULATE SGPA
========================= */

calculateButton.addEventListener(
    "click",
    function () {

        const rows =
            container.querySelectorAll(".subject-row");


        let creditsSum = 0;

        let pointsSum = 0;


        hideError();


        for (let row of rows) {

            const credits =
                parseFloat(
                    row.querySelector(
                        ".subject-credit"
                    ).value
                );


            const grade =
                row.querySelector(
                    ".subject-grade"
                ).value;


            if (
                isNaN(credits) ||
                credits <= 0
            ) {

                showError(
                    "Please enter valid credits for every subject."
                );

                return;
            }


            if (grade === "") {

                showError(
                    "Please select a grade for every subject."
                );

                return;
            }


            const gradePoint =
                parseFloat(grade);


            creditsSum += credits;

            pointsSum +=
                credits * gradePoint;

        }


        if (creditsSum <= 0) {

            showError(
                "Please enter your subject details."
            );

            return;
        }


        const sgpa =
            pointsSum / creditsSum;


        const percentage =
            sgpa * 10;


        result.textContent =
            sgpa.toFixed(2);


        totalCredits.textContent =
            creditsSum.toFixed(1);


        totalPoints.textContent =
            pointsSum.toFixed(2);


        percentageResult.textContent =
            percentage.toFixed(2) + "%";

    }
);


/* =========================
   RESET
========================= */

resetButton.addEventListener(
    "click",
    function () {

        location.reload();

    }
);


/* =========================
   ERROR
========================= */

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

}


function hideError() {

    errorMessage.textContent = "";

    errorMessage.style.display =
        "none";

}


/* =========================
   INITIAL EVENTS
========================= */

document
    .querySelector(".subject-grade")
    .addEventListener(
        "change",
        function () {

            updateGradePoint(
                this.closest(".subject-row")
            );

        }
    );


attachRemoveButton(
    document.querySelector(".remove-subject")
);

});
