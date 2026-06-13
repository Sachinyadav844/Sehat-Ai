from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import json
import openai
from datetime import datetime
import logging

from rag.pipelines.rag_pipeline import RAGPipeline

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SehatAgent AI Service", version="1.0.0")

# Initialize OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY', '')

# Initialize RAG
rag_pipeline = RAGPipeline()

def build_medical_context(query: str, language: str = 'en', emergency: bool = False) -> str:
    try:
        rag_result = rag_pipeline.retrieve_context(query, language=language, emergency=emergency)
        snippets = []
        for idx, item in enumerate(rag_result.get('results', [])[:4], start=1):
            content = item.get('content', '')
            source = item.get('source', f'context-{idx}')
            if content:
                snippets.append(f"[{source}] {content}")
        return '\n\n'.join(snippets)
    except Exception as error:
        logger.warning('RAG context fetch failed: %s', error)
        return ''

# ======================
# DATA MODELS
# ======================

class Symptom(BaseModel):
    name: str
    duration: Optional[str] = None
    severity: Optional[str] = None
    reported: bool = False

class RiskAssessment(BaseModel):
    riskScore: float = Field(..., ge=0, le=1)
    level: str = Field(..., pattern='^(low|medium|high|critical)$')
    confidence: float = Field(..., ge=0, le=1)
    details: Optional[str] = None

class SymptomExtractionInput(BaseModel):
    text: str
    language: str = "en"
    consultationId: str

class SeverityAssessmentInput(BaseModel):
    symptoms: List[Symptom]
    consultationId: str
    language: str = "en"

class SafetyCheckInput(BaseModel):
    text: str
    symptoms: List[Symptom]
    riskLevel: str
    consultationId: str
    language: str = "en"

class HospitalFindingInput(BaseModel):
    symptoms: List[Symptom]
    riskLevel: str
    consultationId: str
    language: str = "en"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AppointmentAdviceInput(BaseModel):
    symptoms: List[Symptom]
    consultationId: str
    language: str = "en"

class ReportGenerationInput(BaseModel):
    consultationId: str
    consultation: str

class TranslationInput(BaseModel):
    text: str
    language: str

class RagSearchInput(BaseModel):
    query: str
    language: str = "en"
    emergency: bool = False

class MedicalRetrieveInput(BaseModel):
    query: str
    language: str = "en"

class MedicalValidateInput(BaseModel):
    query: str
    language: str = "en"
    expected: Optional[List[Dict[str, Any]]] = None

class AdviceInput(BaseModel):
    symptoms: List[Symptom]
    consultationId: str
    language: str = "en"

# ======================
# SYMPTOM EXTRACTION AGENT
# ======================

@app.post("/agents/symptom")
async def extract_symptoms(payload: SymptomExtractionInput):
    """Extract symptoms from patient transcript using LLM"""
    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail='OPENAI_API_KEY not set')

        prompt_context = build_medical_context(payload.text, payload.language)
        prompt = f"""You are a medical assistant. Analyze the patient's statement and extract medical symptoms.

Medical context:
{prompt_context}

Patient statement: {payload.text}
Language: {payload.language}

Respond with a JSON object containing:
{{
    "symptoms": [
        {{"name": "symptom_name", "duration": "how_long", "severity": "mild|moderate|severe"}},
    ],
    "confidence": 0.0-1.0,
    "notes": "any_additional_notes"
}}

Only extract explicit symptoms mentioned by the patient."""

        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.3
        )

        content = response.choices[0].message.content
        result = json.loads(content)

        return {
            "ok": True,
            "symptoms": result.get("symptoms", []),
            "confidence": result.get("confidence", 0.5),
            "notes": result.get("notes", "")
        }
    except json.JSONDecodeError:
        logger.error("Failed to parse LLM response")
        return {
            "ok": False,
            "symptoms": [],
            "error": "Failed to parse symptoms"
        }
    except Exception as error:
        logger.error(f"Symptom extraction error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

# ======================
# SEVERITY ASSESSMENT AGENT
# ======================

@app.post("/agents/severity")
async def assess_severity(payload: SeverityAssessmentInput):
    """Assess severity and risk level of symptoms"""
    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail='OPENAI_API_KEY not set')

        symptoms_text = ", ".join([f"{s.name} (severity: {s.severity}, duration: {s.duration})" for s in payload.symptoms])
        prompt_context = build_medical_context(symptoms_text, payload.language)

        prompt = f"""You are a clinical risk assessment AI. Evaluate the severity of these symptoms using the retrieved medical context.

Medical context:
{prompt_context}

Symptoms: {symptoms_text}
Language: {payload.language}

Respond with a JSON object:
{{
    "score": 0.0-1.0,
    "level": "low|medium|high|critical",
    "confidence": 0.0-1.0,
    "details": "assessment_details",
    "requiresEmergency": true|false
}}

Critical symptoms include: chest pain, difficulty breathing, severe bleeding, loss of consciousness, severe head injury."""

        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.2
        )

        content = response.choices[0].message.content
        result = json.loads(content)

        return {
            "ok": True,
            "score": result.get("score", 0.5),
            "level": result.get("level", "medium"),
            "confidence": result.get("confidence", 0.5),
            "details": result.get("details", ""),
            "requiresEmergency": result.get("requiresEmergency", False)
        }
    except Exception as error:
        logger.error(f"Severity assessment error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

# ======================
# SAFETY CHECK AGENT
# ======================

@app.post("/agents/safety")
async def check_safety(payload: SafetyCheckInput):
    """Check for safety concerns and emergency conditions"""
    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail='OPENAI_API_KEY not set')

        symptoms_text = ", ".join([s.name for s in payload.symptoms])
        prompt_context = build_medical_context(payload.text, payload.language)

        prompt = f"""You are a medical safety AI. Check for emergency conditions and safety concerns using retrieved medical context.

Medical context:
{prompt_context}

Patient text: {payload.text}
Symptoms: {symptoms_text}
Risk level: {payload.riskLevel}

Respond with JSON:
{{
    "escalate": true|false,
    "message": "escalation_message_if_needed",
    "issues": ["list", "of", "safety", "concerns"],
    "emergencyType": "none|chest|breathing|bleeding|consciousness|trauma",
    "recommendations": ["immediate", "actions"]
}}

Emergency keywords: chest pain, can't breathe, unconscious, severe bleeding, head injury, overdose, poisoning."""

        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.1
        )

        content = response.choices[0].message.content
        result = json.loads(content)

        return {
            "ok": True,
            "escalate": result.get("escalate", False),
            "message": result.get("message", ""),
            "issues": result.get("issues", []),
            "emergencyType": result.get("emergencyType", "none"),
            "recommendations": result.get("recommendations", [])
        }
    except Exception as error:
        logger.error(f"Safety check error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

# ======================
# HOSPITAL FINDING AGENT
# ======================

@app.post("/agents/hospital")
async def find_hospitals(payload: HospitalFindingInput):
    """Find nearby hospitals suitable for the patient's condition"""
    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail='OPENAI_API_KEY not set')

        symptoms_text = ", ".join([s.name for s in payload.symptoms])
        prompt_context = build_medical_context(symptoms_text, payload.language)

        prompt = f"""You are a hospital recommendation AI. Suggest appropriate hospitals using medical retrieval context.

Medical context:
{prompt_context}

Patient symptoms: {symptoms_text}
Risk level: {payload.riskLevel}
Language: {payload.language}

Respond with JSON:
{{
    "hospitals": [
        {{"name": "Hospital Name", "type": "emergency|general|specialized", "distance": 5.2, "rating": 4.5}},
    ],
    "reasoning": "why_these_hospitals",
    "urgency": "routine|urgent|emergency"
}}

Focus on emergency hospitals for high-risk cases."""

        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.3
        )

        content = response.choices[0].message.content
        result = json.loads(content)

        return {
            "ok": True,
            "hospitals": result.get("hospitals", []),
            "reasoning": result.get("reasoning", ""),
            "urgency": result.get("urgency", "routine")
        }
    except Exception as error:
        logger.error(f"Hospital finding error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

# ======================
# APPOINTMENT ADVICE AGENT
# ======================

@app.post("/agents/appointment")
async def generate_appointment_advice(payload: AppointmentAdviceInput):
    """Generate appointment booking advice"""
    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail='OPENAI_API_KEY not set')

        symptoms_text = ", ".join([s.name for s in payload.symptoms])
        prompt_context = build_medical_context(symptoms_text, payload.language)

        prompt = f"""You are a medical appointment scheduler AI. Generate appointment advice using medical context.

Medical context:
{prompt_context}

Patient symptoms: {symptoms_text}
Language: {payload.language}

Respond with JSON:
{{
    "advice": ["recommendation1", "recommendation2", ...],
    "specialistType": "general_practice|cardiology|neurology|...",
    "urgency": "routine|urgent|emergency",
    "estimatedWait": "2-3 days"
}}"""

        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.3
        )

        content = response.choices[0].message.content
        result = json.loads(content)

        return {
            "ok": True,
            "advice": result.get("advice", []),
            "specialistType": result.get("specialistType", "general_practice"),
            "urgency": result.get("urgency", "routine"),
            "estimatedWait": result.get("estimatedWait", "2-3 days")
        }
    except Exception as error:
        logger.error(f"Appointment advice error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

# ======================
# REPORT GENERATION AGENT
# ======================

@app.post("/agents/report")
async def generate_report(payload: ReportGenerationInput):
    """Generate comprehensive medical report"""
    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail='OPENAI_API_KEY not set')

        prompt = f"""You are a medical report writer. Create a professional medical summary.

Consultation data: {payload.consultation}

Generate a structured report with:
- Summary of symptoms
- Risk assessment
- Recommendations
- Follow-up care
- Lifestyle advice

Keep it concise and professional."""

        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.3
        )

        content = response.choices[0].message.content

        return {
            "ok": True,
            "report": content,
            "generatedAt": datetime.now().isoformat()
        }
    except Exception as error:
        logger.error(f"Report generation error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

# ======================
# TRANSLATION AGENT
# ======================

@app.post("/agents/translate")
async def translate_text(payload: TranslationInput):
    """Translate text to specified language"""
    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail='OPENAI_API_KEY not set')

        prompt = f"""Translate the following text to {payload.language}. Only provide the translation, nothing else.

Text: {payload.text}"""

        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.3
        )

        translatedText = response.choices[0].message.content

        return {
            "ok": True,
            "translatedText": translatedText,
            "language": payload.language
        }
    except Exception as error:
        logger.error(f"Translation error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

# ======================
# RAG & MEDICAL CONTEXT APIS
# ======================

@app.post("/rag/search")
async def rag_search(payload: RagSearchInput):
    try:
        result = rag_pipeline.retrieve_context(payload.query, language=payload.language, emergency=payload.emergency)
        return {"ok": True, "data": result}
    except Exception as error:
        logger.error(f"RAG search error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/rag/context")
async def rag_context(payload: MedicalRetrieveInput):
    try:
        result = rag_pipeline.retrieve_context(payload.query, language=payload.language)
        return {"ok": True, "context": result}
    except Exception as error:
        logger.error(f"RAG context error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/rag/emergency")
async def rag_emergency(payload: RagSearchInput):
    try:
        result = rag_pipeline.retrieve_context(payload.query, language=payload.language, emergency=True)
        return {"ok": True, "context": result}
    except Exception as error:
        logger.error(f"RAG emergency error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/rag/multilingual")
async def rag_multilingual(payload: MedicalRetrieveInput):
    try:
        result = rag_pipeline.retrieve_context(payload.query, language=payload.language)
        return {"ok": True, "context": result}
    except Exception as error:
        logger.error(f"RAG multilingual error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/medical/retrieve")
async def medical_retrieve(payload: MedicalRetrieveInput):
    try:
        result = rag_pipeline.retrieve_context(payload.query, language=payload.language)
        return {"ok": True, "data": result}
    except Exception as error:
        logger.error(f"Medical retrieve error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/medical/validate")
async def medical_validate(payload: MedicalValidateInput):
    try:
        context = rag_pipeline.retrieve_context(payload.query, language=payload.language)
        return {
            "ok": True,
            "validation": {
                "context": context,
                "expectedLength": len(payload.expected or []),
            },
        }
    except Exception as error:
        logger.error(f"Medical validate error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/agents/advice")
async def generate_medical_advice(payload: AdviceInput):
    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail='OPENAI_API_KEY not set')

        prompt_context = build_medical_context(
            query=", ".join([s.name for s in payload.symptoms]),
            language=payload.language,
        )

        prompt = f"""You are a clinical medical advisor. Use retrieved medical context to provide guidance.

Medical context:
{prompt_context}

Patient symptoms: {', '.join([s.name for s in payload.symptoms])}
Language: {payload.language}

Respond with a JSON object:
{{
    "advice": ["recommendation1", "recommendation2"],
    "explanation": "why_this_advice",
    "confidence": 0.0-1.0
}}
"""

        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.3
        )

        content = response.choices[0].message.content
        result = json.loads(content)

        return {
            "ok": True,
            "advice": result.get("advice", []),
            "explanation": result.get("explanation", ""),
            "confidence": result.get("confidence", 0.5),
        }
    except json.JSONDecodeError:
        logger.error("Failed to parse AI advice response")
        return {"ok": False, "advice": [], "error": "Failed to parse advice"}
    except Exception as error:
        logger.error(f"Medical advice error: {error}")
        raise HTTPException(status_code=500, detail=str(error))

# ======================
# HEALTH CHECK
# ======================

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "ok": True,
        "service": "SehatAgent AI Service",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "SehatAgent AI Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "symptom_extraction": "POST /agents/symptom",
            "severity_assessment": "POST /agents/severity",
            "safety_check": "POST /agents/safety",
            "hospital_finding": "POST /agents/hospital",
            "appointment_advice": "POST /agents/appointment",
            "report_generation": "POST /agents/report",
            "translation": "POST /agents/translate"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

