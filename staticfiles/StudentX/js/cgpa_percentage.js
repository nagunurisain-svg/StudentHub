function calculatePercentage() {

    const cgpaInput = document.getElementById("cgpaInput");
    const errorMessage = document.getElementById("errorMessage");
    const results = document.getElementById("results");

    const cgpa = parseFloat(cgpaInput.value);

    errorMessage.style.display = "none";

    if (isNaN(cgpa)) {
        errorMessage.textContent = "Please enter your CGPA.";
        errorMessage.style.display = "block";
        results.style.display = "none";
        return;
    }

    if (cgpa < 0 || cgpa > 10) {
        errorMessage.textContent = "CGPA must be between 0 and 10.";
        errorMessage.style.display = "block";
        results.style.display = "none";
        return;
    }

    const percentage = cgpa * 10;

    document.getElementById("cgpaResult").textContent =
        cgpa.toFixed(2);

    document.getElementById("percentageResult").textContent =
        percentage.toFixed(2) + "%";

    results.style.display = "block";
}


function resetCalculator() {

    document.getElementById("cgpaInput").value = "";

    document.getElementById("errorMessage").style.display = "none";

    document.getElementById("results").style.display = "none";
}