document.addEventListener("DOMContentLoaded", function () {

    const courseContainer = document.getElementById("courseContainer");
    const addCourseBtn = document.getElementById("addCourse");
    const resetBtn = document.getElementById("resetCalculator");
    const calculateBtn = document.getElementById("calculateGpa");

    const errorMessage = document.getElementById("errorMessage");

    const gpaResult = document.getElementById("gpaResult");
    const totalCreditsResult = document.getElementById("totalCredits");
    const totalPointsResult = document.getElementById("totalPoints");
    const percentageResult = document.getElementById("percentageResult");


    // ==========================================
    // UPDATE GRADE POINT
    // ==========================================

    function updateGradePoint(row) {

        const gradeSelect = row.querySelector(".course-grade");
        const gradePointInput = row.querySelector(".grade-point");

        if (!gradeSelect.value) {
            gradePointInput.value = "-";
            return;
        }

        gradePointInput.value = parseFloat(gradeSelect.value).toFixed(1);
    }


    // ==========================================
    // ADD COURSE
    // ==========================================

    function addCourse() {

        const courseNumber =
            courseContainer.querySelectorAll(".course-row").length + 1;

        const row = document.createElement("div");

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

        courseContainer.appendChild(row);

        attachRowEvents(row);
    }


    // ==========================================
    // REMOVE COURSE
    // ==========================================

    function removeCourse(row) {

        const rows =
            courseContainer.querySelectorAll(".course-row");

        if (rows.length <= 1) {

            showError("At least one course is required.");

            return;
        }

        row.remove();

        clearError();

        renumberCourses();
    }


    // ==========================================
    // RENUMBER COURSES
    // ==========================================

    function renumberCourses() {

        const rows =
            courseContainer.querySelectorAll(".course-row");

        rows.forEach(function (row, index) {

            const courseName =
                row.querySelector(".course-name");

            if (
                courseName &&
                (
                    courseName.value === "" ||
                    courseName.value.startsWith("Course ")
                )
            ) {
                courseName.value = `Course ${index + 1}`;
            }

        });
    }


    // ==========================================
    // ATTACH EVENTS TO COURSE ROW
    // ==========================================

    function attachRowEvents(row) {

        const gradeSelect =
            row.querySelector(".course-grade");

        const removeButton =
            row.querySelector(".remove-course");


        gradeSelect.addEventListener("change", function () {

            updateGradePoint(row);

            clearError();

        });


        removeButton.addEventListener("click", function () {

            removeCourse(row);

        });

    }


    // ==========================================
    // CALCULATE GPA
    // ==========================================

    function calculateGPA() {

        const rows =
            courseContainer.querySelectorAll(".course-row");


        let totalCredits = 0;
        let totalPoints = 0;

        clearError();


        for (let i = 0; i < rows.length; i++) {

            const row = rows[i];

            const creditInput =
                row.querySelector(".course-credit");

            const gradeSelect =
                row.querySelector(".course-grade");


            const credits =
                parseFloat(creditInput.value);

            const grade =
                gradeSelect.value;


            // Check credits

            if (
                creditInput.value === "" ||
                isNaN(credits) ||
                credits <= 0
            ) {

                showError(
                    `Please enter valid credits for Course ${i + 1}.`
                );

                creditInput.focus();

                return;
            }


            // Check grade

            if (grade === "") {

                showError(
                    `Please select a grade for Course ${i + 1}.`
                );

                gradeSelect.focus();

                return;
            }


            const gradePoint =
                parseFloat(grade);


            totalCredits += credits;

            totalPoints += credits * gradePoint;


            updateGradePoint(row);
        }


        if (totalCredits <= 0) {

            showError("Total credits must be greater than zero.");

            return;
        }


        const gpa =
            totalPoints / totalCredits;


        const percentage =
            gpa * 10;


        // ==========================================
        // DISPLAY RESULTS
        // ==========================================

        gpaResult.textContent =
            gpa.toFixed(2);


        totalCreditsResult.textContent =
            totalCredits.toFixed(1);


        totalPointsResult.textContent =
            totalPoints.toFixed(2);


        percentageResult.textContent =
            percentage.toFixed(2) + "%";


        clearError();

    }


    // ==========================================
    // RESET
    // ==========================================

    function resetCalculator() {

        courseContainer.innerHTML = `

            <div class="course-row">

                <input
                    type="text"
                    class="course-name"
                    value="Course 1"
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

            </div>

        `;


        gpaResult.textContent = "0.00";

        totalCreditsResult.textContent = "0";

        totalPointsResult.textContent = "0.00";

        percentageResult.textContent = "0.00%";


        clearError();


        const firstRow =
            courseContainer.querySelector(".course-row");

        attachRowEvents(firstRow);

    }


    // ==========================================
    // ERROR MESSAGE
    // ==========================================

    function showError(message) {

        errorMessage.textContent = message;

        errorMessage.style.display = "block";

    }


    function clearError() {

        errorMessage.textContent = "";

        errorMessage.style.display = "none";

    }


    // ==========================================
    // BUTTON EVENTS
    // ==========================================

    addCourseBtn.addEventListener(
        "click",
        addCourse
    );


    resetBtn.addEventListener(
        "click",
        resetCalculator
    );


    calculateBtn.addEventListener(
        "click",
        calculateGPA
    );


    // ==========================================
    // INITIALIZE FIRST ROW
    // ==========================================

    const firstRow =
        courseContainer.querySelector(".course-row");

    if (firstRow) {
        attachRowEvents(firstRow);
    }

});