document.addEventListener("DOMContentLoaded", function () {

    const tableBody =
        document.getElementById("percentageTableBody");

    const addSubjectButton =
        document.getElementById("addSubject");

    const resetButton =
        document.getElementById("resetPercentage");

    const calculateButton =
        document.getElementById("calculatePercentage");

    const errorBox =
        document.getElementById("percentageError");

    const totalObtained =
        document.getElementById("totalObtained");

    const totalMaximum =
        document.getElementById("totalMaximum");

    const overallPercentage =
        document.getElementById("overallPercentage");


    /* =========================================
       SHOW ERROR
       ========================================= */

    function showError(message) {

        errorBox.textContent = message;

        errorBox.style.display = "block";
    }


    /* =========================================
       HIDE ERROR
       ========================================= */

    function hideError() {

        errorBox.textContent = "";

        errorBox.style.display = "none";
    }


    /* =========================================
       UPDATE SUBJECT PERCENTAGE
       ========================================= */

    function updateSubjectPercentage(row) {

        const obtainedInput =
            row.querySelector(".marks-obtained");

        const maximumInput =
            row.querySelector(".maximum-marks");

        const percentageCell =
            row.querySelector(".subject-percentage");


        const obtained =
            parseFloat(obtainedInput.value);

        const maximum =
            parseFloat(maximumInput.value);


        if (
            !isNaN(obtained) &&
            !isNaN(maximum) &&
            maximum > 0 &&
            obtained >= 0 &&
            obtained <= maximum
        ) {

            const percentage =
                (obtained / maximum) * 100;

            percentageCell.textContent =
                percentage.toFixed(2) + "%";

        } else {

            percentageCell.textContent = "-";

        }
    }


    /* =========================================
       UPDATE ROW NUMBERS
       ========================================= */

    function updateRowNumbers() {

        const rows =
            tableBody.querySelectorAll("tr");

        rows.forEach(function (row, index) {

            const number =
                row.querySelector(".subject-number");

            number.textContent =
                index + 1;

        });
    }


    /* =========================================
       ATTACH ROW EVENTS
       ========================================= */

    function attachRowEvents(row) {

        const obtainedInput =
            row.querySelector(".marks-obtained");

        const maximumInput =
            row.querySelector(".maximum-marks");

        const removeButton =
            row.querySelector(".remove-subject");


        obtainedInput.addEventListener(
            "input",
            function () {

                updateSubjectPercentage(row);

            }
        );


        maximumInput.addEventListener(
            "input",
            function () {

                updateSubjectPercentage(row);

            }
        );


        removeButton.addEventListener(
            "click",
            function () {

                const rows =
                    tableBody.querySelectorAll("tr");


                if (rows.length > 1) {

                    row.remove();

                    updateRowNumbers();

                } else {

                    row.querySelector(".subject-name").value = "";

                    obtainedInput.value = "";

                    maximumInput.value = "";

                    updateSubjectPercentage(row);

                }

            }
        );

    }


    /* =========================================
       ADD SUBJECT
       ========================================= */

    addSubjectButton.addEventListener(
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
                        class="marks-obtained"
                        placeholder="Obtained"
                        min="0"
                        step="0.01"
                    >

                </td>

                <td>

                    <input
                        type="number"
                        class="maximum-marks"
                        placeholder="Maximum"
                        min="1"
                        step="0.01"
                    >

                </td>

                <td class="subject-percentage">
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


            attachRowEvents(row);

            updateRowNumbers();

        }
    );


    /* =========================================
       CALCULATE
       ========================================= */

    calculateButton.addEventListener(
        "click",
        function () {

            hideError();


            const rows =
                tableBody.querySelectorAll("tr");


            let totalObtainedValue = 0;

            let totalMaximumValue = 0;


            if (rows.length === 0) {

                showError(
                    "Please add at least one subject."
                );

                return;
            }


            for (const row of rows) {

                const obtainedInput =
                    row.querySelector(".marks-obtained");

                const maximumInput =
                    row.querySelector(".maximum-marks");


                const obtained =
                    parseFloat(obtainedInput.value);

                const maximum =
                    parseFloat(maximumInput.value);


                if (isNaN(obtained)) {

                    showError(
                        "Please enter obtained marks for every subject."
                    );

                    obtainedInput.focus();

                    return;
                }


                if (isNaN(maximum)) {

                    showError(
                        "Please enter maximum marks for every subject."
                    );

                    maximumInput.focus();

                    return;
                }


                if (obtained < 0) {

                    showError(
                        "Marks obtained cannot be negative."
                    );

                    obtainedInput.focus();

                    return;
                }


                if (maximum <= 0) {

                    showError(
                        "Maximum marks must be greater than zero."
                    );

                    maximumInput.focus();

                    return;
                }


                if (obtained > maximum) {

                    showError(
                        "Obtained marks cannot be greater than maximum marks."
                    );

                    obtainedInput.focus();

                    return;
                }


                totalObtainedValue += obtained;

                totalMaximumValue += maximum;


                updateSubjectPercentage(row);

            }


            /* =========================================
               FINAL PERCENTAGE
               ========================================= */

            const finalPercentage =
                (totalObtainedValue /
                    totalMaximumValue) * 100;


            totalObtained.textContent =
                totalObtainedValue.toFixed(2);


            totalMaximum.textContent =
                totalMaximumValue.toFixed(2);


            overallPercentage.textContent =
                finalPercentage.toFixed(2) + "%";

        }
    );


    /* =========================================
       RESET
       ========================================= */

    resetButton.addEventListener(
        "click",
        function () {

            location.reload();

        }
    );


    /* =========================================
       INITIAL ROW
       ========================================= */

    const initialRows =
        tableBody.querySelectorAll("tr");


    initialRows.forEach(function (row) {

        attachRowEvents(row);

    });


    updateRowNumbers();

});