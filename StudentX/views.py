import re
from datetime import timedelta

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count
from django.utils import timezone

from pypdf import PdfReader
from docx import Document

from .models import SiteVisit, ToolUsage

from django.views.decorators.http import require_POST


def track_visit(request, page_name):
    SiteVisit.objects.create(
        ip_address=request.META.get("REMOTE_ADDR"),
        page=page_name
    )


def home(request):
    track_visit(request, "Home")
    return render(request, "StudentX/home.html")


def cgpa(request):
    track_visit(request, "CGPA Calculator")
    return render(request, "StudentX/cgpa.html")


def sgpa(request):
    track_visit(request, "SGPA Calculator")
    return render(request, "StudentX/sgpa.html")


def percentage(request):
    track_visit(request, "Percentage Calculator")
    return render(request, "StudentX/percentage.html")


def gpa(request):
    track_visit(request, "GPA Calculator")
    return render(request, "StudentX/gpa.html")


def marks(request):
    track_visit(request, "Marks Calculator")
    return render(request, "StudentX/marks.html")


def attendance(request):
    track_visit(request, "Attendance Calculator")
    return render(request, "StudentX/attendance.html")


def required_marks(request):
    track_visit(request, "Required Marks Calculator")
    return render(request, "StudentX/required_marks.html")


def backlog(request):
    track_visit(request, "Backlog Calculator")
    return render(request, "StudentX/backlog.html")


def cgpa_percentage(request):
    track_visit(request, "CGPA Percentage Calculator")
    return render(request, "StudentX/cgpa_percentage.html")


def diploma_cgpa(request):
    track_visit(request, "Diploma CGPA Calculator")
    return render(request, "StudentX/diploma_cgpa.html")


# ==========================================
# RESUME ANALYZER
# ==========================================

def resume_analyzer(request):

    # ==========================================
    # OPEN PAGE
    # ==========================================

    if request.method == "GET":

        return render(
            request,
            "StudentX/resume_analyzer.html"
        )


    # ==========================================
    # ONLY POST ALLOWED FOR ANALYSIS
    # ==========================================

    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "error": "Invalid request."
        }, status=405)


    # ==========================================
    # GET UPLOADED FILE
    # ==========================================

    resume_file = request.FILES.get("resume")


    if not resume_file:

        return JsonResponse({
            "success": False,
            "error": "No resume file was uploaded."
        }, status=400)


    filename = resume_file.name.lower()


    try:

        # ==========================================
        # PDF
        # ==========================================

        if filename.endswith(".pdf"):

            reader = PdfReader(resume_file)

            text = ""

            for page in reader.pages:

                page_text = (
                    page.extract_text() or ""
                )

                text += page_text + "\n"


        # ==========================================
        # DOCX
        # ==========================================

        elif filename.endswith(".docx"):

            document = Document(resume_file)

            text = "\n".join(
                paragraph.text
                for paragraph in document.paragraphs
            )


        # ==========================================
        # DOC
        # ==========================================

        elif filename.endswith(".doc"):

            return JsonResponse({
                "success": False,
                "error": "Please convert DOC to PDF or DOCX."
            }, status=400)


        # ==========================================
        # INVALID FORMAT
        # ==========================================

        else:

            return JsonResponse({
                "success": False,
                "error": "Unsupported file format."
            }, status=400)


        # ==========================================
        # CHECK EXTRACTED TEXT
        # ==========================================

        clean_text = text.lower().strip()


        if len(clean_text) < 30:

            return JsonResponse({
                "success": False,
                "error": "Could not extract enough text from the resume."
            }, status=400)


        # ==========================================
        # CONTACT INFORMATION
        # ==========================================

        has_email = bool(
            re.search(
                r"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}",
                clean_text
            )
        )


        has_phone = bool(
            re.search(
                r"(\+91[\s-]?)?[6-9]\d{9}",
                clean_text
            )
        )


        has_linkedin = (
            "linkedin" in clean_text
        )


        has_github = (
            "github" in clean_text
        )


        # ==========================================
        # EDUCATION
        # ==========================================

        education_words = [
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
        ]


        education_count = sum(
            word in clean_text
            for word in education_words
        )


        # ==========================================
        # EXPERIENCE
        # ==========================================

        experience_words = [
            "experience",
            "internship",
            "intern",
            "employment",
            "worked",
            "developer",
            "engineer",
            "company"
        ]


        experience_count = sum(
            word in clean_text
            for word in experience_words
        )


        # ==========================================
        # SKILLS
        # ==========================================

        technical_skills = [
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
            "rest api",
            "rest apis"
        ]


        found_skills = [
            skill
            for skill in technical_skills
            if skill in clean_text
        ]


        # ==========================================
        # PROJECTS
        # ==========================================

        project_words = [
            "project",
            "projects",
            "developed",
            "built",
            "application",
            "website",
            "system"
        ]


        project_count = sum(
            word in clean_text
            for word in project_words
        )


        # ==========================================
        # CERTIFICATIONS
        # ==========================================

        certification_words = [
            "certification",
            "certifications",
            "certificate",
            "certified",
            "course",
            "courses"
        ]


        certification_count = sum(
            word in clean_text
            for word in certification_words
        )


        # ==========================================
        # ACHIEVEMENTS
        # ==========================================

        achievement_words = [
            "achievement",
            "achievements",
            "award",
            "awards",
            "winner",
            "competition",
            "hackathon",
            "accomplishment"
        ]


        achievement_count = sum(
            word in clean_text
            for word in achievement_words
        )


        # ==========================================
        # SCORE
        # ==========================================

        score = 0


        # Personal Information = 10

        if has_email:
            score += 5

        if has_phone:
            score += 5


        # Education = 10

        if education_count >= 3:
            score += 10

        elif education_count >= 2:
            score += 8

        elif education_count == 1:
            score += 5


        # Experience = 15

        if experience_count >= 3:
            score += 15

        elif experience_count >= 1:
            score += 8


        # Skills = 15

        if len(found_skills) >= 6:
            score += 15

        elif len(found_skills) >= 3:
            score += 10

        elif len(found_skills) >= 1:
            score += 5


        # Projects = 15

        if project_count >= 3:
            score += 15

        elif project_count >= 1:
            score += 8


        # Certifications = 5

        if certification_count >= 2:
            score += 5

        elif certification_count == 1:
            score += 3


        # Achievements = 5

        if achievement_count >= 2:
            score += 5

        elif achievement_count == 1:
            score += 3


        # LinkedIn + GitHub = 5

        if has_linkedin:
            score += 3

        if has_github:
            score += 2


        # ==========================================
        # RESUME LENGTH
        # ==========================================

        word_count = len(
            clean_text.split()
        )


        if 300 <= word_count <= 900:

            score += 5

        elif 150 <= word_count < 300:

            score += 3


        # ==========================================
        # ACTION WORDS
        # ==========================================

        action_words = [
            "developed",
            "built",
            "created",
            "implemented",
            "designed",
            "managed",
            "led",
            "improved",
            "optimized",
            "develop",
            "build"
        ]


        found_action_words = [
            word
            for word in action_words
            if word in clean_text
        ]


        if len(found_action_words) >= 4:

            score += 5

        elif len(found_action_words) >= 2:

            score += 3


        score = min(
            score,
            100
        )


        # ==========================================
        # CATEGORY LABELS
        # ==========================================

        personal_label = (
            "Excellent"
            if has_email and has_phone
            else "Good"
            if has_email or has_phone
            else "Needs Work"
        )


        education_label = (
            "Excellent"
            if education_count >= 3
            else "Good"
            if education_count >= 2
            else "Needs Work"
        )


        experience_label = (
            "Excellent"
            if experience_count >= 3
            else "Good"
            if experience_count >= 1
            else "Needs Work"
        )


        skills_label = (
            "Excellent"
            if len(found_skills) >= 6
            else "Good"
            if len(found_skills) >= 3
            else "Basic"
            if len(found_skills) >= 1
            else "Needs Work"
        )


        # ==========================================
        # SUGGESTIONS
        # ==========================================

        suggestions = []


        if not has_email:

            suggestions.append(
                "Add a professional email address."
            )


        if not has_phone:

            suggestions.append(
                "Add your phone number."
            )


        if education_count < 2:

            suggestions.append(
                "Add detailed education information including degree, college and graduation year."
            )


        if experience_count < 2:

            suggestions.append(
                "Add internship or relevant work experience if available."
            )


        if len(found_skills) < 5:

            suggestions.append(
                "Add more relevant technical skills for your target job."
            )


        if project_count < 2:

            suggestions.append(
                "Add detailed projects with technologies used and your contribution."
            )


        if certification_count == 0:

            suggestions.append(
                "Add relevant certifications or courses."
            )


        if achievement_count == 0:

            suggestions.append(
                "Add achievements, awards, competitions or measurable accomplishments."
            )


        if not has_linkedin:

            suggestions.append(
                "Add your LinkedIn profile."
            )


        if not has_github:

            suggestions.append(
                "Add your GitHub profile if you have coding projects."
            )


        if word_count < 300:

            suggestions.append(
                "Your resume is quite short. Add relevant details without unnecessary information."
            )


        if word_count > 900:

            suggestions.append(
                "Your resume may be too long. Keep it focused and concise."
            )


        if len(found_action_words) < 3:

            suggestions.append(
                "Use stronger action words such as Developed, Built, Implemented and Designed."
            )


        if not suggestions:

            suggestions.append(
                "Excellent! Your resume has strong ATS-friendly content."
            )


        return JsonResponse({

            "success": True,

            "score": score,

            "personal": personal_label,

            "education": education_label,

            "experience": experience_label,

            "skills": skills_label,

            "suggestions": suggestions,

            "found_skills": found_skills,

            "word_count": word_count,

            "linkedin": has_linkedin,

            "github": has_github

        })


    except Exception as error:

        print(
            "Resume analyzer error:",
            error
        )


        return JsonResponse({

            "success": False,

            "error": "Unable to process the resume."

        }, status=500)


def robots_txt(request):
    return HttpResponse(
        "User-agent: *\n"
        "Allow: /\n\n"
        "Sitemap: https://studenthub-kmob.onrender.com/sitemap.xml\n",
        content_type="text/plain"
    )


@staff_member_required
def analytics_dashboard(request):
    total_visits = SiteVisit.objects.count()

    today = timezone.now().date()

    today_visits = SiteVisit.objects.filter(
        visited_at__date=today
    ).count()

    last_7_days = timezone.now() - timedelta(days=7)

    weekly_visits = SiteVisit.objects.filter(
        visited_at__gte=last_7_days
    ).count()

    unique_visitors = (
        SiteVisit.objects
        .values("ip_address")
        .distinct()
        .count()
    )

    popular_tools = (
        SiteVisit.objects
        .exclude(page="Home")
        .values("page")
        .annotate(total=Count("id"))
        .order_by("-total")
    )

    resume_analyses = ToolUsage.objects.filter(
        tool_name="Resume Analyzer"
    ).count()

    daily_visits = []

    for i in range(6, -1, -1):
        day = timezone.now().date() - timedelta(days=i)

        count = SiteVisit.objects.filter(
            visited_at__date=day
        ).count()

        daily_visits.append({
            "date": day.strftime("%d %b"),
            "count": count,
        })

    context = {
        "total_visits": total_visits,
        "today_visits": today_visits,
        "weekly_visits": weekly_visits,
        "unique_visitors": unique_visitors,
        "resume_analyses": resume_analyses,
        "popular_tools": popular_tools,
        "daily_visits": daily_visits,
    }

    return render(
        request,
        "StudentX/analytics.html",
        context
    )

@staff_member_required
@require_POST
def record_tool_usage(request):
    tool_name = request.POST.get("tool_name")

    if not tool_name:
        return JsonResponse({
            "success": False,
            "error": "Tool name is required."
        }, status=400)

    ToolUsage.objects.create(
        tool_name=tool_name
    )

    return JsonResponse({
        "success": True
    })