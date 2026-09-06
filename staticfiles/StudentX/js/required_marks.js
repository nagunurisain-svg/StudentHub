document.addEventListener("DOMContentLoaded", function () {


    const currentMarks =
        document.getElementById("currentMarks");

    const completedMaximum =
        document.getElementById("completedMaximum");

    const remainingMaximum =
        document.getElementById("remainingMaximum");

    const targetPercentage =
        document.getElementById("targetPercentage");


    const calculateButton =
        document.getElementById("calculateRequired");

    const resetButton =
        document.getElementById("resetRequired");


    const errorBox =
        document.getElementById("requiredError");


    const targetTotal =
        document.getElementById("targetTotal");

    const alreadyObtained =
        document.getElementById("alreadyObtained");

    const requiredMarks =
        document.getElementById("requiredMarks");

    const requiredRemainingPercentage =
        document.getElementById(
            "requiredRemainingPercentage"
        );


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


            const current =
                parseFloat(currentMarks.value);

            const completed =
                parseFloat(completedMaximum.value);

            const remaining =
                parseFloat(remainingMaximum.value);

            const target =
                parseFloat(targetPercentage.value);


            /* VALIDATION */

            if (isNaN(current)) {

                showError(
                    "Please enter marks obtained so far."
                );

                currentMarks.focus();

                return;
            }


            if (isNaN(completed)) {

                showError(
                    "Please enter maximum marks completed."
                );

                completedMaximum.focus();

                return;
            }


            if (isNaN(remaining)) {

                showError(
                    "Please enter remaining maximum marks."
                );

                remainingMaximum.focus();

                return;
            }


            if (isNaN(target)) {

                showError(
                    "Please enter your target percentage."
                );

                targetPercentage.focus();

                return;
            }


            if (current < 0) {

                showError(
                    "Marks obtained cannot be negative."
                );

                return;
            }


            if (completed <= 0) {

                showError(
                    "Completed maximum marks must be greater than zero."
                );

                return;
            }


            if (remaining <= 0) {

                showError(
                    "Remaining maximum marks must be greater than zero."
                );

                return;
            }


            if (current > completed) {

                showError(
                    "Marks obtained cannot be greater than completed maximum marks."
                );

                return;
            }


            if (target < 0 || target > 100) {

                showError(
                    "Target percentage must be between 0 and 100."
                );

                return;
            }


            /* TOTAL MAXIMUM */

            const totalMaximum =
                completed + remaining;


            /* TARGET TOTAL */

            const targetMarks =
                (totalMaximum * target) / 100;


            /* REQUIRED MARKS */

            const needed =
                targetMarks - current;


            /* REQUIRED % IN REMAINING */

            const remainingPercentage =
                (needed / remaining) * 100;


            /* DISPLAY */

            targetTotal.textContent =
                targetMarks.toFixed(2);


            alreadyObtained.textContent =
                current.toFixed(2);


            if (needed <= 0) {

                requiredMarks.textContent =
                    "Already Achieved";

                requiredRemainingPercentage.textContent =
                    "0%";

            } else if (needed > remaining) {

                requiredMarks.textContent =
                    "Not Possible";

                requiredRemainingPercentage.textContent =
                    remainingPercentage.toFixed(2) + "%";

            } else {

                requiredMarks.textContent =
                    needed.toFixed(2);

                requiredRemainingPercentage.textContent =
                    remainingPercentage.toFixed(2) + "%";

            }

        }
    );


    /* RESET */

    resetButton.addEventListener(
        "click",
        function () {

            currentMarks.value = "";

            completedMaximum.value = "";

            remainingMaximum.value = "";

            targetPercentage.value = "";


            targetTotal.textContent =
                "0";

            alreadyObtained.textContent =
                "0";

            requiredMarks.textContent =
                "0";

            requiredRemainingPercentage.textContent =
                "0%";


            hideError();

        }
    );

});