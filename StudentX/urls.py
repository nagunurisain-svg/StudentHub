from django.urls import path
from django.contrib.sitemaps.views import sitemap

from . import views
from .sitemaps import StudentHubSitemap

urlpatterns = [
    path("", views.home, name="home"),
    path("cgpa/", views.cgpa, name="cgpa"),
    path("sgpa/", views.sgpa, name="sgpa"),
    path("percentage/", views.percentage, name="percentage"),
    path("gpa/", views.gpa, name="gpa"),
    path("marks/", views.marks, name="marks"),
    path("attendance/", views.attendance, name="attendance"),
    path("required-marks/", views.required_marks, name="required_marks"),
    path("backlog/", views.backlog, name="backlog"),
    path("cgpa-to-percentage/", views.cgpa_percentage, name="cgpa_percentage"),
    path("diploma-cgpa/", views.diploma_cgpa, name="diploma_cgpa"),
    path("resume-analyzer/", views.resume_analyzer, name="resume_analyzer"),
    path("robots.txt", views.robots_txt, name="robots_txt"),

    path(
        "analytics/",
        views.analytics_dashboard,
        name="analytics"
    ),

    path(
        "record-tool-usage/",
        views.record_tool_usage,
        name="record_tool_usage"
    ),

    path(
    "sitemap.xml",
    sitemap,
    {"sitemaps": {"studenthub": StudentHubSitemap}},
    name="django.contrib.sitemaps.views.sitemap",
),
]