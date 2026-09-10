"""
F 02: Text Extraction
Extracts raw text from uploaded PDF resumes using PyMuPDF, and flags
scanned or unreadable PDFs instead of silently returning nothing.
"""

import pymupdf as fitz


def extract_text_from_pdf(file_bytes: bytes) -> tuple[str, str]:
    """
    Returns (text, status).
    status is one of: ok, empty_text, parse_error
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text("text") + "\n"
        doc.close()
    except Exception:
        return "", "parse_error"

    text = text.strip()
    if len(text) < 20:
        return text, "empty_text"
    return text, "ok"