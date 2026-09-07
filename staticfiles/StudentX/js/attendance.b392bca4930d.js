document.addEventListener("DOMContentLoaded", function () {

    const tableBody =
        document.getElementById("attendanceTableBody");

    const addButton =
        document.getElementById("addSubject");

    const resetButton =
        document.getElementById("resetAttendance");

    const calculateButton =
        document.getElementById("calculateAttendance");

    const errorBox =
        document.getElementById("attendanceError");

    const totalAttended =
        document.getElementById("totalAttended");

    const totalClasses =
        document.getElementById("totalClasses");

    const overallAttendance =
        document.getElementById("overallAttendance");


    /* SHOW ERROR */

    function showError(message) {

        errorBox.textContent = message;

        errorBox.style.display = "block";

    }


    /* HIDE ERROR */

    function hideError() {

        errorBox.textContent = "";

        errorBox.style.display = "none";

    }


    /* UPDATE SUBJECT ATTENDANCE */

    function updateAttendance(row) {

        const attendedInput =
            row.querySelector(".classes-attended");

        const totalInput =
            row.querySelector(".total-classes");

        const attendanceCell =
            row.querySelector(".subject-attendance");


        const attended =
            parseFloat(attendedInput.value);

        const total =
            parseFloat(totalInput.value);


        if (
            !isNaN(attended) &&
            !isNaN(total) &&
            total > 0 &&
            attended >= 0 &&
            attended <= total
        ) {

            const percentage =
                (attended / total) * 100;


            attendanceCell.textContent =
                percentage.toFixed(2) + "%";

        } else {

            attendanceCell.textContent = "-";

        }

    }


    /* UPDATE NUMBERS */

    function updateNumbers() {

        const rows =
            tableBody.querySelectorAll("tr");


        rows.forEach(function (row, index) {

            row.querySelector(
                ".subject-number"
            ).textContent = index + 1;

        });

    }


    /* ATTACH EVENTS */

    function attachEvents(row) {

        const attendedInput =
            row.querySelector(".classes-attended");

        const totalInput =
            row.querySelector(".total-classes");

        const removeButton =
            row.querySelector(".remove-subject");


        attendedInput.addEventListener(
            "input",
            function () {

                updateAttendance(row);

            }
        );


        totalInput.addEventListener(
            "input",
            function () {

                updateAttendance(row);

            }
        );


        removeButton.addEventListener(
            "click",
            function () {

                const rows =
                    tableBody.querySelectorAll("tr");


                if (rows.length > 1) {

                    row.remove();

                    updateNumbers();

                } else {

                    row.querySelector(
                        ".subject-name"
                    ).value = "";

                    attendedInput.value = "";

                    totalInput.value = "";

                    updateAttendance(row);

                }

            }
        );

    }


    /* ADD SUBJECT */

    addButton.addEventListener(
        "click",
        function () {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td class="subject-number">
                    1
                </td>

                <td>

                    <input
                        type="text"
                        class="subject-name"
                        placeholder="Subject"
                    >

                </td>

                <td>

                    <input
                        type="number"
                        class="classes-attended"
                        placeholder="Attended"
                        min="0"
                        step="1"
                    >

                </td>

                <td>

                    <input
                        type="number"
                        class="total-classes"
                        placeholder="Total"
                        min="1"
                        step="1"
                    >

                </td>

                <td class="subject-attendance">
                    -
                </td>

                <td>

                    <button
                        type="button"
                        class="remove-subject"
                    >
                        Remove
                    </button>

                </td>

            `;


            tableBody.appendChild(row);


            attachEvents(row);

            updateNumbers();

        }
    );


    /* CALCULATE */

    calculateButton.addEventListener(
        "click",
        function () {

            hideError();


            const rows =
                tableBody.querySelectorAll("tr");


            let attendedTotal = 0;

            let classesTotal = 0;


            if (rows.length === 0) {

                showError(
                    "Please add at least one subject."
                );

                return;
            }


            for (const row of rows) {

                const attendedInput =
                    row.querySelector(
                        ".classes-attended"
                    );

                const totalInput =
                    row.querySelector(
                        ".total-classes"
                    );


                const attended =
                    parseFloat(attendedInput.value);

                const total =
                    parseFloat(totalInput.value);


                if (isNaN(attended)) {

                    showError(
                        "Please enter classes attended for every subject."
                    );

                    attendedInput.focus();

                    return;
                }


                if (isNaN(total)) {

                    showError(
                        "Please enter total classes for every subject."
                    );

                    totalInput.focus();

                    return;
                }


                if (attended < 0) {

                    showError(
                        "Classes attended cannot be negative."
                    );

                    attendedInput.focus();

                    return;
                }


                if (total <= 0) {

                    showError(
                        "Total classes must be greater than zero."
                    );

                    totalInput.focus();

                    return;
                }


                if (attended > total) {

                    showError(
                        "Classes attended cannot be greater than total classes."
                    );

                    attendedInput.focus();

                    return;
                }


                attendedTotal += attended;

                classesTotal += total;


                updateAttendance(row);

            }


            const finalAttendance =
                (attendedTotal / classesTotal) * 100;


            totalAttended.textContent =
                attendedTotal;


            totalClasses.textContent =
                classesTotal;


            overallAttendance.textContent =
                finalAttendance.toFixed(2) + "%";

        }
    );


    /* RESET */

    resetButton.addEventListener(
        "click",
        function () {

            location.reload();

        }
    );


    /* INITIAL ROW */

    const initialRows =
        tableBody.querySelectorAll("tr");


    initialRows.forEach(function (row) {

        attachEvents(row);

    });


    updateNumbers();

});