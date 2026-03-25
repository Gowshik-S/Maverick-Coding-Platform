from typing import Dict, List

SKILL_KEYWORDS = [
    "python",
    "javascript",
    "typescript",
    "java",
    "c++",
    "golang",
    "react",
    "vue",
    "angular",
    "node",
    "django",
    "fastapi",
    "flask",
    "sql",
    "postgresql",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "azure",
    "machine learning",
    "deep learning",
    "data structures",
    "algorithms",
    "system design",
    "rest api",
]

EXPERIENCE_KEYWORDS = [
    "year",
    "years",
    "worked",
    "experience",
    "engineer",
    "developer",
    "intern",
    "internship",
    "built",
    "developed",
    "designed",
    "led",
]

EDUCATION_KEYWORDS = [
    "university",
    "college",
    "b.tech",
    "b.e",
    "degree",
    "bachelor",
    "master",
    "graduated",
    "bca",
    "mca",
    "bsc",
]

ROLE_KEYWORDS = [
    "engineer",
    "developer",
    "analyst",
    "intern",
    "student",
    "fresher",
    "architect",
    "manager",
    "lead",
    "consultant",
]


def check_completeness(resume_text: str, extracted_skills: Dict[str, str]) -> Dict[str, object]:
    text = resume_text.lower()
    missing: List[str] = []
    questions: Dict[str, Dict[str, object]] = {}

    if len(extracted_skills) < 2:
        raw = [kw for kw in SKILL_KEYWORDS if kw in text]
        if len(raw) < 2:
            missing.append("skills")
            questions["skills"] = {
                "label": "Your Primary Skills",
                "type": "multiselect",
                "options": [
                    "Python",
                    "JavaScript",
                    "Java",
                    "React",
                    "Node.js",
                    "SQL",
                    "Docker",
                    "AWS",
                    "Machine Learning",
                    "DSA",
                    "System Design",
                    "C++",
                    "TypeScript",
                ],
                "required": True,
            }

    if not any(kw in text for kw in EXPERIENCE_KEYWORDS):
        missing.append("experience")
        questions["experience"] = {
            "label": "Years of Experience",
            "type": "select",
            "options": [
                "Fresher (0-1 years)",
                "1-2 years",
                "2-5 years",
                "5-8 years",
                "8+ years",
            ],
            "required": True,
        }

    if not any(kw in text for kw in EDUCATION_KEYWORDS):
        missing.append("education")
        questions["education"] = {
            "label": "Highest Education",
            "type": "select",
            "options": [
                "B.E / B.Tech",
                "M.E / M.Tech",
                "BCA / MCA",
                "BSc CS",
                "Diploma",
                "Self-taught / Bootcamp",
            ],
            "required": True,
        }

    if not any(kw in text for kw in ROLE_KEYWORDS):
        missing.append("current_role")
        questions["current_role"] = {
            "label": "Your Current Role",
            "type": "text",
            "placeholder": "e.g. Software Engineer, Student",
            "required": True,
        }

    return {
        "complete": len(missing) == 0,
        "missing": missing,
        "questions": questions,
        "missing_count": len(missing),
    }
