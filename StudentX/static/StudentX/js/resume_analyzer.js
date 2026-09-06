/* ==========================================
   RESUME ANALYZER
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

const uploadProgress =
    document.getElementById("uploadProgress");

const uploadPercentage =
    document.getElementById("uploadPercentage");

const progressFill =
    document.getElementById("progressFill");


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
   VALIDATE FILE
   ========================================== */

function validateFile(file) {

    errorMessage.textContent = "";

    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ];

    const extension =
        file.name.split(".").pop().toLowerCase();

    const allowedExtensions =
        ["pdf", "docx", "doc"];


    if (!allowedExtensions.includes(extension)) {

        showError(
            "Please upload a PDF, DOC or DOCX file."
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

    errorMessage.textContent = "";


    /* Upload progress */

    uploadProgress.style.display = "block";

    let progress = 0;

    uploadPercentage.textContent = "0%";

    progressFill.style.width = "0%";


    const progressTimer =
        setInterval(function () {

            progress += 5;

            uploadPercentage.textContent =
                progress + "%";

            progressFill.style.width =
                progress + "%";


            if (progress >= 100) {

                clearInterval(progressTimer);

                uploadPercentage.textContent =
                    "Upload Complete";

            }

        }, 50);

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

removeFile.addEventListener("click", function () {

    resetFile();

});


function resetFile() {

    resumeFile.value = "";

    selectedFile.style.display = "none";

    analyzeBtn.disabled = true;

    analysisResults.style.display = "none";

    errorMessage.textContent = "";

    uploadProgress.style.display = "none";

    uploadPercentage.textContent = "0%";

    progressFill.style.width = "0%";

}


/* ==========================================
   ERROR
   ========================================== */

function showError(message) {

    errorMessage.textContent = message;

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


    analyzeBtn.disabled = true;

    analyzeBtn.textContent =
        "Analyzing Resume...";


    errorMessage.textContent = "";


    try {

        const text =
            await extractResumeText(file);


        if (!text || text.trim().length < 30) {

            throw new Error(
                "Could not read enough text from this resume."
            );

        }


        analyzeResume(text);


    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to read this resume. Please try a text-based PDF or DOCX file."
        );

    }


    analyzeBtn.disabled = false;

    analyzeBtn.textContent =
        "Analyze Resume →";

});


/* ==========================================
   EXTRACT RESUME TEXT
   ========================================== */

async function extractResumeText(file) {

    const extension =
        file.name.split(".").pop().toLowerCase();


    /* ======================================
       PDF
       ====================================== */

    if (extension === "pdf") {

        if (typeof pdfjsLib === "undefined") {

            throw new Error(
                "PDF library not loaded."
            );

        }


        const arrayBuffer =
            await file.arrayBuffer();

        const pdf =
            await pdfjsLib.getDocument({
                data: arrayBuffer
            }).promise;


        let fullText = "";


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(pageNumber);


            const content =
                await page.getTextContent();


            const pageText =
                content.items
                    .map(item => item.str)
                    .join(" ");


            fullText +=
                pageText + "\n";

        }


        return fullText;

    }


    /* ======================================
       DOCX
       ====================================== */

    if (extension === "docx") {

        if (typeof mammoth === "undefined") {

            throw new Error(
                "DOCX library not loaded."
            );

        }


        const arrayBuffer =
            await file.arrayBuffer();


        const result =
            await mammoth.extractRawText({
                arrayBuffer: arrayBuffer
            });


        return result.value;

    }


    /* ======================================
       DOC
       ====================================== */

    if (extension === "doc") {

        throw new Error(
            "Old DOC format is not supported in browser analysis. Please save it as PDF or DOCX."
        );

    }


    throw new Error(
        "Unsupported file format."
    );

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


    analyzeBtn.disabled = true;

    analyzeBtn.textContent =
        "Uploading & Analyzing...";

    errorMessage.textContent = "";


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
           SEND FILE TO DJANGO
           ========================================== */

        const response = await fetch(
            window.location.href,
            {
                method: "POST",
                body: formData,

                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                }
            }
        );


        /* ==========================================
           READ DJANGO RESPONSE
           ========================================== */

        const data =
            await response.json();


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


    analyzeBtn.disabled = false;

    analyzeBtn.textContent =
        "Analyze Resume →";

});


/* ==========================================
   GET CSRF COOKIE
   ========================================== */

function getCookie(name) {

    let cookieValue = null;


    if (document.cookie &&
        document.cookie !== "") {

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

    document.getElementById(
        "resumeScore"
    ).textContent = data.score;


    /* ==========================================
       PERSONAL
       ========================================== */

    document.getElementById(
        "personalScore"
    ).textContent = data.personal;


    /* ==========================================
       EDUCATION
       ========================================== */

    document.getElementById(
        "educationScore"
    ).textContent = data.education;


    /* ==========================================
       EXPERIENCE
       ========================================== */

    document.getElementById(
        "experienceScore"
    ).textContent = data.experience;


    /* ==========================================
       SKILLS
       ========================================== */

    document.getElementById(
        "skillsScore"
    ).textContent = data.skills;


    /* ==========================================
       SUGGESTIONS
       ========================================== */

    const suggestionsList =
        document.getElementById(
            "suggestionsList"
        );


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


    /* ==========================================
       SHOW RESULTS
       ========================================== */

    analysisResults.style.display =
        "block";


    analysisResults.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


    /* ======================================
       SECTION CHECKS
       ====================================== */

    const personal =
        checkPersonalInformation(cleanText);

    const education =
        checkEducation(cleanText);

    const experience =
        checkExperience(cleanText);

    const skills =
        checkSkills(cleanText);

    const projects =
        checkProjects(cleanText);

    const certifications =
        checkCertifications(cleanText);

    const achievements =
        checkAchievements(cleanText);

    const links =
        checkLinks(cleanText);


    /* ======================================
       SCORE
       ====================================== */

    let score = 0;


    score += personal.score;
    score += education.score;
    score += experience.score;
    score += skills.score;
    score += projects.score;
    score += certifications.score;
    score += achievements.score;
    score += links.score;


    /* Maximum = 100 */

    score = Math.min(100, score);


    /* ======================================
       DISPLAY MAIN SCORE
       ====================================== */

    document.getElementById("resumeScore")
        .textContent = score;


    /* ======================================
       DISPLAY CATEGORY SCORES
       ====================================== */

    document.getElementById("personalScore")
        .textContent = personal.label;


    document.getElementById("educationScore")
        .textContent = education.label;


    document.getElementById("experienceScore")
        .textContent = experience.label;


    document.getElementById("skillsScore")
        .textContent = skills.label;


    /* ======================================
       SUGGESTIONS
       ====================================== */

    const suggestions = [];


    if (!personal.complete) {

        suggestions.push(
            "Add complete contact information including phone number and email."
        );

    }


    if (!education.complete) {

        suggestions.push(
            "Add detailed education information such as degree, college and graduation year."
        );

    }


    if (!experience.complete) {

        suggestions.push(
            "Add internship, work experience or relevant practical experience."
        );

    }


    if (!skills.complete) {

        suggestions.push(
            "Add more relevant technical and professional skills."
        );

    }


    if (!projects.complete) {

        suggestions.push(
            "Add 1–3 projects with technologies used and a short description."
        );

    }


    if (!certifications.complete) {

        suggestions.push(
            "Consider adding relevant certifications or courses."
        );

    }


    if (!achievements.complete) {

        suggestions.push(
            "Add achievements, competitions, awards or measurable accomplishments."
        );

    }


    if (!links.complete) {

        suggestions.push(
            "Add LinkedIn and GitHub links if applicable."
        );

    }


    if (suggestions.length === 0) {

        suggestions.push(
            "Excellent! Your resume contains the major sections. Keep the information concise and up to date."
        );

    }


    displaySuggestions(suggestions);


    /* ======================================
       SHOW RESULTS
       ====================================== */

    analysisResults.style.display = "block";


    analysisResults.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });



/* ==========================================
   PERSONAL INFORMATION
   ========================================== */

function checkPersonalInformation(text) {

    const hasEmail =
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
            .test(text);


    const hasPhone =
        /(\+91[\s-]?)?[6-9]\d{9}/
            .test(text);


    const hasName =
        text.split(/\s+/).length >= 3;


    let score = 0;

    if (hasEmail) score += 5;
    if (hasPhone) score += 5;


    return {

        score: score,

        complete:
            hasEmail && hasPhone,

        label:
            hasEmail && hasPhone
                ? "Excellent"
                : hasEmail || hasPhone
                    ? "Good"
                    : "Needs Work"

    };

}


/* ==========================================
   EDUCATION
   ========================================== */

function checkEducation(text) {

    const keywords = [
        "education",
        "b.tech",
        "btech",
        "b.e",
        "bachelor",
        "master",
        "degree",
        "diploma",
        "college",
        "university",
        "school",
        "cgpa",
        "gpa"
    ];


    const count =
        countKeywords(text, keywords);


    let score = 0;


    if (count >= 2) score = 10;
    else if (count === 1) score = 6;


    return {

        score: score,

        complete: count >= 2,

        label:
            count >= 3
                ? "Excellent"
                : count >= 2
                    ? "Good"
                    : "Needs Work"

    };

}


/* ==========================================
   EXPERIENCE
   ========================================== */

function checkExperience(text) {

    const keywords = [
        "experience",
        "internship",
        "intern",
        "worked",
        "employment",
        "developer",
        "engineer",
        "job",
        "company"
    ];


    const count =
        countKeywords(text, keywords);


    let score = 0;


    if (count >= 3) score = 15;
    else if (count >= 1) score = 8;


    return {

        score: score,

        complete: count >= 2,

        label:
            count >= 3
                ? "Excellent"
                : count >= 1
                    ? "Good"
                    : "Needs Work"

    };

}


/* ==========================================
   SKILLS
   ========================================== */

function checkSkills(text) {

    const skills = [
        "python",
        "java",
        "javascript",
        "html",
        "css",
        "sql",
        "django",
        "react",
        "c++",
        "c#",
        "node",
        "git",
        "github",
        "mysql",
        "mongodb",
        "excel",
        "communication",
        "leadership"
    ];


    const found =
        skills.filter(skill =>
            text.includes(skill)
        );


    let score = 0;


    if (found.length >= 6) score = 15;
    else if (found.length >= 3) score = 10;
    else if (found.length >= 1) score = 5;


    return {

        score: score,

        complete: found.length >= 3,

        label:
            found.length >= 6
                ? "Excellent"
                : found.length >= 3
                    ? "Good"
                    : found.length >= 1
                        ? "Basic"
                        : "Needs Work"

    };

}


/* ==========================================
   PROJECTS
   ========================================== */

function checkProjects(text) {

    const keywords = [
        "project",
        "projects",
        "developed",
        "built",
        "application",
        "website",
        "system"
    ];


    const count =
        countKeywords(text, keywords);


    let score = 0;


    if (count >= 3) score = 15;
    else if (count >= 1) score = 8;


    return {

        score: score,

        complete: count >= 2,

        label:
            count >= 3
                ? "Excellent"
                : count >= 1
                    ? "Good"
                    : "Needs Work"

    };

}


/* ==========================================
   CERTIFICATIONS
   ========================================== */

function checkCertifications(text) {

    const keywords = [
        "certification",
        "certifications",
        "certificate",
        "certified",
        "course",
        "courses"
    ];


    const count =
        countKeywords(text, keywords);


    let score = 0;


    if (count >= 2) score = 5;
    else if (count === 1) score = 3;


    return {

        score: score,

        complete: count >= 1,

        label:
            count >= 2
                ? "Good"
                : count === 1
                    ? "Basic"
                    : "Optional"

    };

}


/* ==========================================
   ACHIEVEMENTS
   ========================================== */

function checkAchievements(text) {

    const keywords = [
        "achievement",
        "achievements",
        "award",
        "awards",
        "winner",
        "competition",
        "hackathon",
        "accomplishment"
    ];


    const count =
        countKeywords(text, keywords);


    let score = 0;


    if (count >= 2) score = 5;
    else if (count === 1) score = 3;


    return {

        score: score,

        complete: count >= 1,

        label:
            count >= 2
                ? "Good"
                : count === 1
                    ? "Basic"
                    : "Optional"

    };

}


/* ==========================================
   LINKS
   ========================================== */

function checkLinks(text) {

    const hasLinkedIn =
        text.includes("linkedin");


    const hasGitHub =
        text.includes("github");


    let score = 0;


    if (hasLinkedIn) score += 3;

    if (hasGitHub) score += 2;


    return {

        score: score,

        complete:
            hasLinkedIn || hasGitHub,

        label:
            hasLinkedIn && hasGitHub
                ? "Excellent"
                : hasLinkedIn || hasGitHub
                    ? "Good"
                    : "Optional"

    };

}


/* ==========================================
   COUNT KEYWORDS
   ========================================== */

function countKeywords(text, keywords) {

    let count = 0;


    keywords.forEach(function (keyword) {

        if (text.includes(keyword)) {

            count++;

        }

    });


    return count;

}


/* ==========================================
   DISPLAY SUGGESTIONS
   ========================================== */

function displaySuggestions(suggestions) {

    const list =
        document.getElementById(
            "suggestionsList"
        );


    list.innerHTML = "";


    suggestions.forEach(function (suggestion) {

        const li =
            document.createElement("li");


        li.textContent = suggestion;


        list.appendChild(li);

    });

}