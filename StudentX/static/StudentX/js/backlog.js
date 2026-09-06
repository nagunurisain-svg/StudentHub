document.addEventListener("DOMContentLoaded", function () {


    const totalSubjects =
        document.getElementById("totalSubjects");

    const backlogSubjects =
        document.getElementById("backlogSubjects");


    const calculateButton =
        document.getElementById("calculateBacklog");

    const resetButton =
        document.getElementById("resetBacklog");


    const errorBox =
        document.getElementById("backlogError");


    const resultTotal =
        document.getElementById("resultTotal");

    const resultBacklogs =
        document.getElementById("resultBacklogs");

    const resultCleared =
        document.getElementById("resultCleared");

    const resultCompletion =
        document.getElementById("resultCompletion");


    /* ERROR */

    function showError(message) {

        errorBox.textContent = message;

        errorBox.style.display = "block";

    }


    function hideError() {

        errorBox.textContent = "";

        errorBox.style.display = "none";

    }


    /* CALCULATE */

    calculateButton.addEventListener(
        "click",
        function () {

            hideError();


            const total =
                parseInt(totalSubjects.value);

            const backlogs =
                parseInt(backlogSubjects.value);


            /* VALIDATION */

            if (isNaN(total)) {

                showError(
                    "Please enter the total number of subjects."
                );

                totalSubjects.focus();

                return;
            }


            if (isNaN(backlogs)) {

                showError(
                    "Please enter the number of current backlogs."
                );

                backlogSubjects.focus();

                return;
            }


            if (total < 0) {

                showError(
                    "Total subjects cannot be negative."
                );

                return;
            }


            if (backlogs < 0) {

                showError(
                    "Backlogs cannot be negative."
                );

                return;
            }


            if (backlogs > total) {

                showError(
                    "Backlogs cannot be greater than total subjects."
                );

                backlogSubjects.focus();

                return;
            }


            if (total === 0) {

                showError(
                    "Total subjects must be greater than zero."
                );

                return;
            }


            /* CALCULATION */

            const cleared =
                total - backlogs;


            const completion =
                (cleared / total) * 100;


            /* DISPLAY */

            resultTotal.textContent =
                total;


            resultBacklogs.textContent =
                backlogs;


            resultCleared.textContent =
                cleared;


            resultCompletion.textContent =
                completion.toFixed(2) + "%";

        }
    );


    /* RESET */

    resetButton.addEventListener(
        "click",
        function () {

            totalSubjects.value = "";

            backlogSubjects.value = "";


            resultTotal.textContent =
                "0";

            resultBacklogs.textContent =
                "0";

            resultCleared.textContent =
                "0";

            resultCompletion.textContent =
                "0%";


            hideError();

        }
    );

});