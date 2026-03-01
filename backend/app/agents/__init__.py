"""Agent module exports."""

from .community_agent import analyze_community_url
from .email_agent import analyze_email
from .teacher_agent import build_teaching_plan
from .url_agent import analyze_url

# Backward-compatible alias for older imports.
analyze_community_content = analyze_community_url

__all__ = [
    "analyze_community_url",
    "analyze_community_content",
    "analyze_email",
    "build_teaching_plan",
    "analyze_url",
]
