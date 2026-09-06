document.addEventListener("DOMContentLoaded", function () {

    const container =
        document.getElementById("courseContainer");

    const addButton =
        document.getElementById("addCourse");

    const calculateButton =
        document.getElementById("calculateGpa");

    const resetButton =
        document.getElementById("resetCalculator");

    const result =
        document.getElementById("gpaResult");

    const totalCredits =
        document.getElementById("totalCredits");

    const totalPoints =
        document.getElementById("totalPoints");

    const percentageResult =
        document.getElementById("percentageResult");

    const errorMessage =
        document.getElementById("errorMessage");


    let courseNumber = 1;


    /* =========================
       UPDATE GRADE POINT
    ========================= */

    function updateGradePoint(row) {

        const grade =
            row.querySelector(".course-grade").value;

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
       ADD COURSE
    ========================= */

    addButton.addEventListener("click", function () {

        courseNumber++;


        const row =
            document.createElement("div");

        row.className = "course-row";


        row.innerHTML = `

            <input
                type="text"
                class="course-name"
                value="Course ${courseNumber}"
                placeholder="Course name"
            >

            <input
                type="number"
                class="course-credit"
                placeholder="Credits"
                min="0"
                step="0.5"
            >

            <select class="course-grade">

                <option value="">
                    Select
                </option>

                <option value="10">
                    O
                </option>

                <option value="9">
                    A+
                </option>

                <option value="8">
                    A
                </option>

                <option value="7">
                    B+
                </option>

                <option value="6">
                    B
                </option>

                <option value="5">
                    C
                </option>

                <option value="4">
                    P
                </option>

                <option value="0">
                    F
                </option>

            </select>

            <input
                type="text"
                class="grade-point"
                value="-"
                readonly
            >

            <button
                type="button"
                class="remove-course"
                aria-label="Remove course"
            >
                ×
            </button>
        `;


        container.appendChild(row);


        row.querySelector(".course-grade")
            .addEventListener(
                "change",
                function () {

                    updateGradePoint(row);

                }
            );


        attachRemoveButton(
            row.querySelector(".remove-course")
        );

    });


    /* =========================
       REMOVE COURSE
    ========================= */

    function attachRemoveButton(button) {

        button.addEventListener("click", function () {

            const rows =
                container.querySelectorAll(".course-row");


            if (rows.length <= 1) {

                showError(
                    "At least one course is required."
                );

                return;
            }


            button.closest(".course-row").remove();


            renumberCourses();

        });

    }


    function renumberCourses() {

        const rows =
            container.querySelectorAll(".course-row");


        rows.forEach(function (row, index) {

            row.querySelector(".course-name").value =
                "Course " + (index + 1);

        });


        courseNumber = rows.length;

    }


    /* =========================
       CALCULATE GPA
    ========================= */

    calculateButton.addEventListener(
        "click",
        function () {

            const rows =
                container.querySelectorAll(".course-row");


            let creditsSum = 0;

            let pointsSum = 0;


            hideError();


            for (const row of rows) {

                const credits =
                    parseFloat(
                        row.querySelector(
                            ".course-credit"
                        ).value
                    );


                const grade =
                    row.querySelector(
                        ".course-grade"
                    ).value;


                if (
                    isNaN(credits) ||
                    credits <= 0
                ) {

                    showError(
                        "Please enter valid credits for every course."
                    );

                    return;
                }


                if (grade === "") {

                    showError(
                        "Please select a grade for every course."
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
                    "Please enter your course details."
                );

                return;
            }


            const gpa =
                pointsSum / creditsSum;


            const percentage =
                gpa * 10;


            result.textContent =
                gpa.toFixed(2);


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

        errorMessage.textContent =
            "";

        errorMessage.style.display =
            "none";

    }


    /* =========================
       INITIAL EVENTS
    ========================= */

    const firstRow =
        container.querySelector(".course-row");


    firstRow.querySelector(".course-grade")
        .addEventListener(
            "change",
            function () {

                updateGradePoint(firstRow);

            }
        );


    attachRemoveButton(
        firstRow.querySelector(".remove-course")
    );

});