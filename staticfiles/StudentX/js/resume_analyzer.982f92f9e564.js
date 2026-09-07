/* ==========================================
   RESUME ANALYZER
   Django Backend Version
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       ELEMENTS
       ========================================== */

    const resumeFile = document.getElementById("resumeFile");
    const uploadArea = document.getElementById("uploadArea");
    const selectedFile = document.getElementById("selectedFile");
    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");
    const removeFile = document.getElementById("removeFile");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const errorMessage = document.getElementById("errorMessage");
    const analysisResults = document.getElementById("analysisResults");

    const uploadProgress = document.getElementById("uploadProgress");
    const uploadPercentage = document.getElementById("uploadPercentage");
    const progressFill = document.getElementById("progressFill");


    /* ==========================================
       MOBILE MENU
       ========================================== */

    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");

    if (menuBtn && navMenu) {

        menuBtn.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });

    }


    /* ==========================================
       CHECK REQUIRED ELEMENTS
       ========================================== */

    if (!resumeFile || !analyzeBtn) {
        console.error("Resume Analyzer elements not found.");
        return;
    }


    /* ==========================================
       FILE SELECTION
       ========================================== */

    resumeFile.addEventListener("change", function () {

        const file = resumeFile.files[0];

        if (!file) {
            return;
        }

        validateFile(file);

    });


    /* ==========================================
       UPLOAD AREA CLICK
       ========================================== */

    if (uploadArea) {

        uploadArea.addEventListener("click", function (event) {

            if (
                event.target !== removeFile &&
                !removeFile?.contains(event.target)
            ) {
                resumeFile.click();
            }

        });

    }


    /* ==========================================
       VALIDATE FILE
       ========================================== */

    function validateFile(file) {

        clearError();

        const extension =
            file.name.split(".").pop().toLowerCase();

        const allowedExtensions = [
            "pdf",
            "docx"
        ];

        if (!allowedExtensions.includes(extension)) {

            showError(
                "Please upload a PDF or DOCX file."
            );

            resetFile();
            return;

        }


        /* Maximum 5 MB */

        if (file.size > 5 * 1024 * 1024) {

            showError(
                "Resume size must be less than 5 MB."
            );

            resetFile();
            return;

        }


        displayFile(file);

    }


    /* ==========================================
       DISPLAY FILE
       ========================================== */

    function displayFile(file) {

        fileName.textContent = file.name;

        fileSize.textContent =
            formatFileSize(file.size);

        selectedFile.style.display = "flex";

        analyzeBtn.disabled = false;

        analysisResults.style.display = "none";

        clearError();

        if (uploadProgress) {
            uploadProgress.style.display = "none";
        }

        if (uploadPercentage) {
            uploadPercentage.textContent = "0%";
        }

        if (progressFill) {
            progressFill.style.width = "0%";
        }

    }


    /* ==========================================
       FORMAT FILE SIZE
       ========================================== */

    function formatFileSize(bytes) {

        if (bytes < 1024) {
            return bytes + " Bytes";
        }

        if (bytes < 1024 * 1024) {

            return (
                bytes / 1024
            ).toFixed(1) + " KB";

        }

        return (
            bytes / (1024 * 1024)
        ).toFixed(2) + " MB";

    }


    /* ==========================================
       REMOVE FILE
       ========================================== */

    if (removeFile) {

        removeFile.addEventListener("click", function (event) {

            event.stopPropagation();

            resetFile();

        });

    }


    /* ==========================================
       RESET FILE
       ========================================== */

    function resetFile() {

        resumeFile.value = "";

        if (selectedFile) {
            selectedFile.style.display = "none";
        }

        analyzeBtn.disabled = true;

        if (analysisResults) {
            analysisResults.style.display = "none";
        }

        clearError();

        if (uploadProgress) {
            uploadProgress.style.display = "none";
        }

        if (uploadPercentage) {
            uploadPercentage.textContent = "0%";
        }

        if (progressFill) {
            progressFill.style.width = "0%";
        }

    }


    /* ==========================================
       ERROR
       ========================================== */

    function showError(message) {

        if (errorMessage) {
            errorMessage.textContent = message;
        }

    }


    function clearError() {

        if (errorMessage) {
            errorMessage.textContent = "";
        }

    }


    /* ==========================================
       ANALYZE BUTTON
       ========================================== */

    analyzeBtn.addEventListener("click", async function () {

        const file = resumeFile.files[0];

        if (!file) {

            showError(
                "Please select a resume first."
            );

            return;

        }


        /* Disable button */

        analyzeBtn.disabled = true;

        analyzeBtn.textContent =
            "Analyzing Resume...";

        clearError();


        /* Show progress */

        if (uploadProgress) {
            uploadProgress.style.display = "block";
        }

        if (uploadPercentage) {
            uploadPercentage.textContent = "0%";
        }

        if (progressFill) {
            progressFill.style.width = "0%";
        }


        try {

            /* ==========================================
               CREATE FORM DATA
               ========================================== */

            const formData = new FormData();

            formData.append(
                "resume",
                file
            );


            /* ==========================================
               GET CSRF TOKEN
               ========================================== */

            const csrfToken =
                getCookie("csrftoken");


            /* ==========================================
               SEND FILE TO DJANGO
               ========================================== */

            const response = await fetch(
                window.location.href,
                {
                    method: "POST",

                    body: formData,

                    headers: {
                        "X-CSRFToken": csrfToken
                    },

                    credentials: "same-origin"
                }
            );


            /* ==========================================
               UPDATE PROGRESS
               ========================================== */

            if (uploadPercentage) {
                uploadPercentage.textContent =
                    "100%";
            }

            if (progressFill) {
                progressFill.style.width =
                    "100%";
            }


            /* ==========================================
               READ RESPONSE
               ========================================== */

            const contentType =
                response.headers.get("content-type") || "";


            if (!contentType.includes("application/json")) {

                throw new Error(
                    "Server returned an invalid response. Please check the Django server logs."
                );

            }


            const data =
                await response.json();


            /* ==========================================
               CHECK RESPONSE
               ========================================== */

            if (!response.ok || !data.success) {

                throw new Error(
                    data.error ||
                    "Resume analysis failed."
                );

            }


            /* ==========================================
               DISPLAY RESULTS
               ========================================== */

            displayBackendResults(data);


            if (uploadPercentage) {
                uploadPercentage.textContent =
                    "Analysis Complete";
            }

        }

        catch (error) {

            console.error(
                "Resume analysis error:",
                error
            );

            showError(
                error.message ||
                "Unable to analyze the resume."
            );

        }

        finally {

            analyzeBtn.disabled = false;

            analyzeBtn.textContent =
                "Analyze Resume →";

        }

    });


    /* ==========================================
       GET CSRF COOKIE
       ========================================== */

    function getCookie(name) {

        let cookieValue = null;

        if (
            document.cookie &&
            document.cookie !== ""
        ) {

            const cookies =
                document.cookie.split(";");


            for (
                let i = 0;
                i < cookies.length;
                i++
            ) {

                const cookie =
                    cookies[i].trim();


                if (
                    cookie.substring(
                        0,
                        name.length + 1
                    ) ===
                    (name + "=")
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


    /* ==========================================
       DISPLAY DJANGO RESULTS
       ========================================== */

    function displayBackendResults(data) {

        /* ==========================================
           MAIN SCORE
           ========================================== */

        const resumeScore =
            document.getElementById("resumeScore");

        if (resumeScore) {
            resumeScore.textContent =
                data.score ?? 0;
        }


        /* ==========================================
           PERSONAL
           ========================================== */

        const personalScore =
            document.getElementById("personalScore");

        if (personalScore) {
            personalScore.textContent =
                data.personal ?? "Needs Work";
        }


        /* ==========================================
           EDUCATION
           ========================================== */

        const educationScore =
            document.getElementById("educationScore");

        if (educationScore) {
            educationScore.textContent =
                data.education ?? "Needs Work";
        }


        /* ==========================================
           EXPERIENCE
           ========================================== */

        const experienceScore =
            document.getElementById("experienceScore");

        if (experienceScore) {
            experienceScore.textContent =
                data.experience ?? "Needs Work";
        }


        /* ==========================================
           SKILLS
           ========================================== */

        const skillsScore =
            document.getElementById("skillsScore");

        if (skillsScore) {
            skillsScore.textContent =
                data.skills ?? "Needs Work";
        }


        /* ==========================================
           SUGGESTIONS
           ========================================== */

        const suggestionsList =
            document.getElementById(
                "suggestionsList"
            );


        if (suggestionsList) {

            suggestionsList.innerHTML = "";


            if (
                data.suggestions &&
                data.suggestions.length > 0
            ) {

                data.suggestions.forEach(
                    function (suggestion) {

                        const li =
                            document.createElement("li");

                        li.textContent =
                            suggestion;

                        suggestionsList.appendChild(li);

                    }
                );

            }

        }


        /* ==========================================
           SHOW RESULTS
           ========================================== */

        if (analysisResults) {

            analysisResults.style.display =
                "block";


            analysisResults.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }

});