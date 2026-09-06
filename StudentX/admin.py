from django.contrib import admin
from .models import SiteVisit, ToolUsage


@admin.register(SiteVisit)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display = ("ip_address", "page", "visited_at")
    list_filter = ("page", "visited_at")
    search_fields = ("ip_address", "page")


@admin.register(ToolUsage)
class ToolUsageAdmin(admin.ModelAdmin):
    list_display = ("tool_name", "used_at")
    list_filter = ("tool_name", "used_at")