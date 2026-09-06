from django.db import models


class SiteVisit(models.Model):
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    page = models.CharField(max_length=200, blank=True)
    visited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.page} - {self.visited_at}"


class ToolUsage(models.Model):
    tool_name = models.CharField(max_length=100)
    used_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tool_name} - {self.used_at}"