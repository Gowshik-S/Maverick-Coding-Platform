import io
from typing import Dict

import fitz
import pdf2image
import pytesseract
from PIL import Image


def extract_from_txt(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore").strip()


def extract_from_docx(file_bytes: bytes) -> str:
    import docx

    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join([p.text for p in doc.paragraphs]).strip()


def is_scanned_pdf(file_bytes: bytes) -> bool:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = "".join(page.get_text() for page in doc)
    return len(text.strip()) < 50


def extract_from_text_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    return "\n".join(page.get_text() for page in doc).strip()


def extract_from_scanned_pdf(file_bytes: bytes) -> str:
    images = pdf2image.convert_from_bytes(file_bytes, dpi=300)
    return "\n".join(pytesseract.image_to_string(img, lang="eng") for img in images).strip()


def extract_from_image(file_bytes: bytes) -> str:
    img = Image.open(io.BytesIO(file_bytes))
    return pytesseract.image_to_string(img, lang="eng").strip()


def extract_resume_text(file_bytes: bytes, filename: str) -> Dict[str, object]:
    ext = filename.lower().split(".")[-1]
    try:
        if ext in ["txt", "text"]:
            text = extract_from_txt(file_bytes)
            method = "plain_text"
        elif ext == "pdf":
            if is_scanned_pdf(file_bytes):
                text = extract_from_scanned_pdf(file_bytes)
                method = "ocr_scanned_pdf"
            else:
                text = extract_from_text_pdf(file_bytes)
                method = "text_pdf"
        elif ext == "docx":
            text = extract_from_docx(file_bytes)
            method = "docx"
        elif ext in ["jpg", "jpeg", "png"]:
            text = extract_from_image(file_bytes)
            method = "ocr_image"
        else:
            # hardcoded/stub: extension fallback decode when parser is unsupported.
            text = file_bytes.decode("utf-8", errors="ignore")
            method = "fallback_decode"

        return {"text": text, "method": method, "success": len(text.strip()) > 30}
    except Exception as exc:
        return {
            "text": "",
            "method": "error",
            "success": False,
            "error": str(exc),
        }
