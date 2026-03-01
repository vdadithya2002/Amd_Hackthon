import os
from pathlib import Path
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


def check_url_with_virustotal(url: str) -> dict:
    """
    Minimal VT client. If no VT_API_KEY, return zeros so backend still works.
    """
    vt_api_key = os.environ.get("VT_API_KEY")
    if not vt_api_key:
        return {"maliciousCount": 0, "totalEngines": 0}

    try:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            return {"maliciousCount": 0, "totalEngines": 0, "error": "invalid_url"}
    except Exception:
        return {"maliciousCount": 0, "totalEngines": 0, "error": "invalid_url"}

    headers = {"x-apikey": vt_api_key}

    try:
        resp = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers=headers,
            data={"url": url},
            timeout=20,
        )
        if resp.status_code >= 400:
            return {
                "maliciousCount": 0,
                "totalEngines": 0,
                "error": f"vt_submit_{resp.status_code}",
            }

        analysis_id = resp.json().get("data", {}).get("id")
        if not analysis_id:
            return {"maliciousCount": 0, "totalEngines": 0, "error": "vt_missing_analysis_id"}

        report = requests.get(
            f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
            headers=headers,
            timeout=20,
        )
        if report.status_code >= 400:
            return {
                "maliciousCount": 0,
                "totalEngines": 0,
                "error": f"vt_report_{report.status_code}",
            }
    except requests.RequestException:
        return {"maliciousCount": 0, "totalEngines": 0, "error": "vt_request_failed"}

    report_json = report.json()
    stats = report_json["data"]["attributes"].get("stats") or report_json["data"]["attributes"].get(
        "last_analysis_stats", {}
    )

    malicious = int(stats.get("malicious", 0))
    total = int(sum(stats.values())) if stats else 0

    return {"maliciousCount": malicious, "totalEngines": total}
