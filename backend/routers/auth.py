from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from agents.profile_agent import run_profile_agent
from db.postgres import execute, fetch_one
from utils.completeness_checker import check_completeness
from utils.resume_parser import extract_resume_text

router = APIRouter()


@router.post("/register")
async def register(
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...),
    extra_skills: Optional[str] = Form(None),
    extra_experience: Optional[str] = Form(None),
    extra_education: Optional[str] = Form(None),
    extra_role: Optional[str] = Form(None),
):
    existing = fetch_one("SELECT id FROM users WHERE email = %s", (email,))
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    file_bytes = await resume.read()
    filename = resume.filename or "resume.txt"

    extracted = extract_resume_text(file_bytes, filename)
    if not extracted["success"]:
        return {
            "error": "Could not read resume",
            "suggestion": "Upload a clearer PDF or TXT",
        }

    resume_text = str(extracted["text"])
    raw_skills = run_profile_agent(resume_text, user_id=None, dry_run=True)
    completeness = check_completeness(resume_text, raw_skills)
    has_extras = any([extra_skills, extra_experience, extra_education, extra_role])

    if not completeness["complete"] and not has_extras:
        return {
            "needs_more_info": True,
            "missing": completeness["missing"],
            "questions": completeness["questions"],
            "extraction_method": extracted["method"],
            "partial_name": name,
        }

    if extra_skills:
        resume_text += f"\nSkills: {extra_skills}"
    if extra_experience:
        resume_text += f"\nExperience: {extra_experience}"
    if extra_education:
        resume_text += f"\nEducation: {extra_education}"
    if extra_role:
        resume_text += f"\nCurrent Role: {extra_role}"

    user_id = execute(
        "INSERT INTO users (name, email, resume_text) VALUES (%s, %s, %s) RETURNING id",
        (name, email, resume_text),
    )
    skills = run_profile_agent(resume_text, user_id)

    return {
        "user_id": user_id,
        "name": name,
        "email": email,
        "skills": skills,
        "extraction_method": extracted["method"],
        "needs_more_info": False,
        "message": "Profile created successfully",
    }


@router.post("/login")
async def login(
    email: str = Form(...),
    password: str = Form(...),
):
    # hardcoded/stub: password is not verified yet; production should hash and verify.
    _ = password
    user = fetch_one(
        "SELECT id, name, email, skills FROM users WHERE email = %s",
        (email,),
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user["id"],
        "name": user["name"],
        "skills": user["skills"],
        "message": "Login successful",
    }


@router.get("/user/{user_id}")
async def get_user(user_id: int):
    user = fetch_one(
        "SELECT id, name, email, skills, created_at FROM users WHERE id = %s",
        (user_id,),
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(user)
