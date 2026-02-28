"""content extraction from URLs"""

from app.models.request_models import AnalyzeRequest
from app.models.analysis_models import ContentMetadata
import httpx
from bs4 import BeautifulSoup


def extract_content(request: AnalyzeRequest) -> tuple[str, ContentMetadata]:
    """Fetch URL and extract text plus metadata."""
    url = str(request.url)
    # fetch URL and extract text plus metadata
    with httpx.Client(follow_redirects=True, timeout=30) as client:
        response = client.get(url)
        response.raise_for_status() # raise error if response is not successful
        html = response.text

    soup = BeautifulSoup(html, "html.parser") # parse HTML

    # get title
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""

    # try common meta fields
    metadata: ContentMetadata = {
        "url": url,
        "title": title,
        "author": "",
        "publish_date": "",
    }

    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        metadata["title"] = og_title["content"]

    author = soup.find("meta", attrs={"name": "author"})
    if author and author.get("content"):
        metadata["author"] = author["content"]

    # article body: prefer main/article tags, fallback to body
    body = soup.find("article") or soup.find("main") or soup.find("body")
    text = body.get_text(separator="\n", strip=True) if body else soup.get_text(separator="\n", strip=True)

    return text, metadata
