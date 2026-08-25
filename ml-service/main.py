from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import re
import random

app = FastAPI(title="AI Career Platform - ML Service")

# ============ MODELS ============

class ResumeRequest(BaseModel):
    text: str

class ReviewRequest(BaseModel):
    text: str

# ============ RESUME ANALYSIS ============

SKILL_DATABASE = {
    'programming': ['python', 'java', 'javascript', 'c++', 'c#', 'typescript', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin'],
    'frontend': ['react', 'angular', 'vue', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery', 'next.js', 'svelte'],
    'backend': ['node.js', 'express', 'django', 'flask', 'spring', 'fastapi', 'rails', 'laravel', 'asp.net'],
    'database': ['mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'sql', 'nosql', 'dynamodb', 'firebase'],
    'devops': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'terraform', 'ci/cd', 'github actions'],
    'tools': ['git', 'jira', 'linux', 'bash', 'postman', 'figma', 'vscode'],
    'ai_ml': ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision', 'pandas', 'numpy', 'scikit-learn'],
    'soft': ['leadership', 'communication', 'teamwork', 'problem solving', 'agile', 'scrum']
}

ROLE_REQUIREMENTS = {
    'Software Developer': {
        'required': ['programming', 'tools', 'database'],
        'nice_to_have': ['devops', 'frontend']
    },
    'Frontend Developer': {
        'required': ['frontend', 'programming'],
        'nice_to_have': ['tools', 'database']
    },
    'Backend Developer': {
        'required': ['backend', 'database', 'programming'],
        'nice_to_have': ['devops', 'tools']
    },
    'Full Stack Developer': {
        'required': ['frontend', 'backend', 'database', 'programming'],
        'nice_to_have': ['devops', 'tools']
    },
    'Data Analyst': {
        'required': ['ai_ml', 'database', 'programming'],
        'nice_to_have': ['tools', 'soft']
    }
}

def extract_skills(text: str) -> List[str]:
    lower_text = text.lower()
    found_skills = []
    for category, skills in SKILL_DATABASE.items():
        for skill in skills:
            if skill.lower() in lower_text:
                found_skills.append(skill)
    return list(set(found_skills))

def calculate_score(skills: List[str]) -> int:
    skill_count = len(skills)
    if skill_count == 0:
        return 20
    elif skill_count <= 3:
        return 40
    elif skill_count <= 6:
        return 60
    elif skill_count <= 10:
        return 75
    else:
        return min(95, 75 + (skill_count - 10) * 2)

def find_missing_skills(skills: List[str]) -> List[str]:
    all_skills = []
    for cat_skills in SKILL_DATABASE.values():
        all_skills.extend(cat_skills)
    lower_skills = [s.lower() for s in skills]
    return [s for s in all_skills if s.lower() not in lower_skills][:5]

def recommend_roles(skills: List[str]) -> List[str]:
    recommendations = []
    lower_skills = [s.lower() for s in skills]
    for role, reqs in ROLE_REQUIREMENTS.items():
        match_count = 0
        for category in reqs['required']:
            cat_skills = [s.lower() for s in SKILL_DATABASE.get(category, [])]
            if any(s in lower_skills for s in cat_skills):
                match_count += 1
        if match_count >= 1:
            recommendations.append((role, match_count))
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return [r[0] for r in recommendations] if recommendations else ['Software Developer']

@app.post("/analyze-resume")
async def analyze_resume(request: ResumeRequest):
    skills = extract_skills(request.text)
    score = calculate_score(skills)
    missing = find_missing_skills(skills)
    roles = recommend_roles(skills)
    return {
        "skills": skills,
        "score": score,
        "missingSkills": missing,
        "recommendedRoles": roles
    }

# ============ REVIEW DETECTION ============

FAKE_KEYWORDS = [
    'amazing', 'best ever', 'guaranteed', 'miracle', 'incredible deal',
    'act now', 'limited time', 'buy now', 'life changing', 'no brainer',
    '100%', 'absolute best', 'must buy', 'dont miss', 'unbelievable'
]

TRUST_KEYWORDS = [
    'used for', 'compared to', 'pros and cons', 'however', 'overall',
    'verified purchase', 'after using', 'months of use', 'balanced',
    'downside', 'criticism', 'mixed feelings', 'average'
]

@app.post("/detect-review")
async def detect_review(request: ReviewRequest):
    text = request.text
    lower = text.lower()
    score = 50
    flags = []

    fake_count = sum(1 for kw in FAKE_KEYWORDS if kw in lower)
    if fake_count > 0:
        score -= fake_count * 8
        flags.append(f"{fake_count} spam keyword(s) found")

    trust_count = sum(1 for kw in TRUST_KEYWORDS if kw in lower)
    if trust_count > 0:
        score += trust_count * 10
        flags.append(f"{trust_count} trust signal(s) found")

    exclamation_count = text.count('!')
    if exclamation_count > 3:
        score -= 15
        flags.append("Excessive exclamation marks")

    caps_words = re.findall(r'\b[A-Z]{3,}\b', text)
    if len(caps_words) > 2:
        score -= 10
        flags.append("Excessive ALL CAPS words")

    word_count = len(text.split())
    if word_count < 20:
        score -= 10
        flags.append("Very short review")
    elif word_count > 100:
        score += 10
        flags.append("Detailed review")

    score = max(0, min(100, score))

    is_genuine = score >= 40
    confidence = abs(score - 50) + 50

    if score >= 70:
        explanation = "This review appears GENUINE. It contains balanced language and trust signals."
    elif score >= 40:
        explanation = "This review is UNCERTAIN. Some elements suggest it could be either genuine or fake."
    else:
        explanation = "This review appears FAKE. Multiple red flags detected."

    return {
        "isGenuine": is_genuine,
        "confidence": confidence,
        "score": score,
        "flags": flags,
        "explanation": explanation
    }

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ml-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
