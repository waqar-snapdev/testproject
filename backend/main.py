import os
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uuid
print(">>> LOADING THE NEW MAIN.PY <<<")

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5139",
    "http://127.0.0.1:5173",
    "https://test-front-6xk4.onrender.com/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-Memory Database ---
# Since local MongoDB is not available, we use in-memory lists.
# Data will be reset when the server restarts.

db = {
    "symptoms": [],
    "medications": [],
    "blood_pressure_logs": [],
    "vitals_logs": [],
    "family_members": [],
    "appointments": []
}

def generate_id():
    return str(uuid.uuid4())

# --- Pydantic Models ---

class Symptom(BaseModel):
   id: str | None = None
   date: datetime = Field(default_factory=datetime.utcnow)
   fatigue: int
   nausea: int
   pain: int
   notes: str | None = None

class Medication(BaseModel):
    id: str | None = None
    name: str
    dosage: str
    frequency: str
    notes: str | None = None

class TimelineEvent(BaseModel):
    id: str
    date: datetime
    type: str
    title: str
    description: str

class BloodPressureLog(BaseModel):
    id: str | None = None
    systolic: int
    diastolic: int
    pulse: int
    date: datetime = Field(default_factory=datetime.utcnow)
    notes: str | None = None

class VitalsLog(BaseModel):
    id: str | None = None
    heart_rate: int
    temperature: float
    oxygen_saturation: int
    date: datetime = Field(default_factory=datetime.utcnow)
    notes: str | None = None

class FamilyMemberCreate(BaseModel):
   name: str
   relation: str

class FamilyMember(BaseModel):
    id: str
    name: str
    relation: str

class Appointment(BaseModel):
    id: str
    date: datetime
    doctor: str
    specialty: str
    location: str
    notes: str | None = None

# --- API Routes ---

@app.get("/")
def read_root():
    return {"Hello": "World", "Status": "Running with In-Memory DB"}

@app.get("/api/v1/healthz")
def health_check():
    return {"status": "ok", "message": "Backend is running (In-Memory)"}

@app.get("/api/v1/symptoms", response_model=List[Symptom])
async def get_symptoms():
    return db["symptoms"]

@app.post("/api/v1/symptoms", response_model=Symptom)
async def create_symptom(symptom: Symptom = Body(...)):
    symptom_data = symptom.model_dump(exclude={"id"})
    symptom_data["id"] = generate_id()
    # Ensure date is set if not provided or keep user provided
    if not symptom_data.get("date"):
        symptom_data["date"] = datetime.utcnow()
    
    new_symptom = Symptom(**symptom_data)
    db["symptoms"].append(new_symptom)
    return new_symptom

@app.post("/api/v1/medications", response_model=Medication)
async def create_medication(medication: Medication = Body(...)):
    med_data = medication.model_dump(exclude={"id"})
    med_data["id"] = generate_id()
    
    new_med = Medication(**med_data)
    db["medications"].append(new_med)
    return new_med

@app.get("/api/v1/medications", response_model=List[Medication])
async def get_medications():
    return db["medications"]

@app.put("/api/v1/medications/{med_id}", response_model=Medication)
async def update_medication(med_id: str, medication: Medication = Body(...)):
    for i, med in enumerate(db["medications"]):
        if med.id == med_id:
            updated_data = medication.model_dump(exclude={"id"})
            updated_data["id"] = med_id
            updated_med = Medication(**updated_data)
            db["medications"][i] = updated_med
            return updated_med
            
    raise HTTPException(status_code=404, detail="Medication not found")

@app.delete("/api/v1/medications/{med_id}")
async def delete_medication(med_id: str):
    initial_count = len(db["medications"])
    db["medications"] = [m for m in db["medications"] if m.id != med_id]
    
    if len(db["medications"]) == initial_count:
        raise HTTPException(status_code=404, detail="Medication not found")
        
    return {"message": "Medication deleted successfully"}

@app.get("/api/v1/timeline", response_model=List[dict])
async def get_timeline():
    timeline_events = []

    for symptom in db["symptoms"]:
        timeline_events.append(
            TimelineEvent(
                id=symptom.id,
                date=symptom.date,
                type="symptom",
                title="Symptom Logged",
                description=f"Fatigue: {symptom.fatigue}, Nausea: {symptom.nausea}, Pain: {symptom.pain}",
            ).model_dump()
        )

    for medication in db["medications"]:
        timeline_events.append(
            TimelineEvent(
                id=medication.id,
                date=datetime.utcnow(), # Medications don't have a date in this model, defaulting to now
                type="medication",
                title=medication.name,
                description=f"Dosage: {medication.dosage}, Frequency: {medication.frequency}",
            ).model_dump()
        )

    timeline_events.sort(key=lambda x: x['date'], reverse=True)
    return timeline_events

@app.post("/api/v1/bloodpressure", response_model=BloodPressureLog)
async def create_blood_pressure_log(log: BloodPressureLog = Body(...)):
    log_data = log.model_dump(exclude={"id"})
    log_data["id"] = generate_id()
    if not log_data.get("date"):
        log_data["date"] = datetime.utcnow()
        
    new_log = BloodPressureLog(**log_data)
    db["blood_pressure_logs"].append(new_log)
    return new_log

@app.get("/api/v1/bloodpressure", response_model=List[BloodPressureLog])
async def get_blood_pressure_logs():
    return db["blood_pressure_logs"]

@app.delete("/api/v1/bloodpressure/{log_id}")
async def delete_blood_pressure_log(log_id: str):
    initial_count = len(db["blood_pressure_logs"])
    db["blood_pressure_logs"] = [l for l in db["blood_pressure_logs"] if l.id != log_id]
    
    if len(db["blood_pressure_logs"]) == initial_count:
        raise HTTPException(status_code=404, detail="Blood pressure log not found")
        
    return {"message": "Blood pressure log deleted successfully"}

@app.post("/api/v1/vitals", response_model=VitalsLog)
async def create_vitals_log(log: VitalsLog = Body(...)):
    log_data = log.model_dump(exclude={"id"})
    log_data["id"] = generate_id()
    if not log_data.get("date"):
        log_data["date"] = datetime.utcnow()
        
    new_log = VitalsLog(**log_data)
    db["vitals_logs"].append(new_log)
    return new_log

@app.get("/api/v1/vitals", response_model=List[VitalsLog])
async def get_vitals_logs():
    return db["vitals_logs"]

@app.delete("/api/v1/vitals/{log_id}")
async def delete_vitals_log(log_id: str):
    initial_count = len(db["vitals_logs"])
    db["vitals_logs"] = [l for l in db["vitals_logs"] if l.id != log_id]
    
    if len(db["vitals_logs"]) == initial_count:
        raise HTTPException(status_code=404, detail="Vitals log not found")
        
    return {"message": "Vitals log deleted successfully"}

@app.get("/api/v1/family", response_model=List[FamilyMember])
async def get_family_members():
    return db["family_members"]

@app.post("/api/v1/family/invite", response_model=FamilyMember)
async def invite_family_member(member: FamilyMemberCreate = Body(...)):
    member_data = member.model_dump()
    new_member = FamilyMember(id=generate_id(), **member_data)
    db["family_members"].append(new_member)
    return new_member

@app.delete("/api/v1/family/{member_id}")
async def remove_family_member(member_id: str):
    initial_count = len(db["family_members"])
    db["family_members"] = [m for m in db["family_members"] if m.id != member_id]
    
    if len(db["family_members"]) == initial_count:
        raise HTTPException(status_code=404, detail="Family member not found")
        
    return {"message": "Family member removed successfully"}

@app.get("/api/v1/appointments", response_model=List[Appointment])
async def get_appointments():
    # Return some mock data if empty, for demonstration
    if not db["appointments"]:
        return [
            Appointment(
                id=generate_id(),
                date=datetime.utcnow(),
                doctor="Dr. Smith",
                specialty="Cardiology",
                location="City Hospital, Room 302",
                notes="Regular checkup"
            )
        ]
    return db["appointments"]