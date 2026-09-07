from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class StudentHubSitemap(Sitemap):

    priority = 0.8
    changefreq = "weekly"

    def items(self):
        return [
            "home",
            "cgpa",
            "sgpa",
            "percentage",
            "gpa",
            "marks",
            "attendance",
            "required_marks",
            "backlog",
            "cgpa_percentage",
            "diploma_cgpa",
            "resume_analyzer",
        ]

    def location(self, item):
        return reverse(item)