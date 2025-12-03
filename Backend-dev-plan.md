# 1. Executive Summary

This document outlines the development plan for a FastAPI backend to support the Health Journey frontend application. The goal is to build a simple, scalable API that provides CRUD functionality for all features visible in the UI.

This plan adheres to the following constraints:
- **Backend:** FastAPI (Python)
- **Database:** MongoDB Atlas (using Motor and Pydantic)
- **Deployment:** No Docker
- **Testing:** Manual, per-task testing via the frontend
- **Workflow:** Single `main` branch on Git

The plan is broken down into dynamic sprints, starting with environment setup and progressively building out each feature.

# 2. In-Scope & Success Criteria

### In-Scope Features
- Health Summary Dashboard
- Symptom Logging (CRUD)
- Medication Tracking (CRUD)
- Blood Pressure Logging (CRUD)
- Vitals Logging (CRUD)
- Family Member Management (CRUD)
- Aggregated Health Timeline View

### Success Criteria
- All frontend features are fully functional and connected to the live backend.
- All manual test steps for every task pass successfully through the UI.
- The final, working code for each sprint is pushed to the `main` branch.

# 3. API Design

- **Base Path:** `/api/v1`
- **Error Envelope:** `{ "error": "message" }`

### Endpoints

- **`GET /healthz`**
  - **Purpose:** Check the health of the server and its database connection.
  - **Response:** `{ "status": "ok", "message": "..." }`

- **`GET /api/v1/symptoms`**
  - **Purpose:** Get all symptom logs.
- **`POST /api/v1/symptoms`**
  - **Purpose:** Create a new symptom log.

- **`GET /api/v1/medications`**
  - **Purpose:** Get all medications.
- **`POST /api/v1/medications`**
  - **Purpose:** Create a new medication.
- **`PUT /api/v1/medications/{med_id}`**
  - **Purpose:** Update an existing medication.
- **`DELETE /api/v1/medications/{med_id}`**
  - **Purpose:** Delete a medication.

- **`GET /api/v1/bloodpressure`**
  - **Purpose:** Get all blood pressure logs.
- **`POST /api/v1/bloodpressure`**
  - **Purpose:** Create a new blood pressure log.
- **`DELETE /api/v1/bloodpressure/{log_id}`**
  - **Purpose:** Delete a blood pressure log.

- **`GET /api/v1/vitals`**
  - **Purpose:** Get all vitals logs.
- **`POST /api/v1/vitals`**
  - **Purpose:** Create a new vitals log.
- **`DELETE /api/v1/vitals/{log_id}`**
  - **Purpose:** Delete a vitals log.

- **`GET /api/v1/family`**
  - **Purpose:** Get all family members.
- **`POST /api/v1/family/invite`**
  - **Purpose:** Add a new family member.
- **`DELETE /api/v1/family/{member_id}`**
  - **Purpose:** Remove a family member.

- **`GET /api/v1/timeline`**
  - **Purpose:** Get an aggregated list of symptoms and medications for the timeline view.

# 4. Data Model (MongoDB Atlas)

- **Collection: `symptoms`**
  - `_id`: ObjectId
  - `date`: DateTime
  - `fatigue`: Integer
  - `nausea`: Integer
  - `pain`: Integer
  - `notes`: String

- **Collection: `medications`**
  - `_id`: ObjectId
  - `name`: String
  - `dosage`: String
  - `frequency`: String
  - `notes`: String

- **Collection: `blood_pressure_logs`**
  - `_id`: ObjectId
  - `systolic`: Integer
  - `diastolic`: Integer
  - `pulse`: Integer
  - `date`: DateTime
  - `notes`: String

- **Collection: `vitals_logs`**
  - `_id`: ObjectId
  - `heart_rate`: Integer
  - `temperature`: Float
  - `oxygen_saturation`: Integer
  - `date`: DateTime
  - `notes`: String

- **Collection: `family_members`**
  - `_id`: ObjectId
  - `name`: String
  - `relation`: String

# 5. Frontend Audit & Feature Map

- **Dashboard (`/`)**: Displays summary cards for recent data.
  - **Needs:** `GET /symptoms`, `GET /medications`, `GET /bloodpressure`, `GET /vitals`.
- **Symptom Tracker (`/symptoms`)**: Form to log symptoms and a table of past logs.
  - **Needs:** `GET /symptoms`, `POST /symptoms`.
- **Medications (`/medications`)**: Table of medications with Add/Edit/Delete functionality.
  - **Needs:** `GET /medications`, `POST /medications`, `PUT /medications/{id}`, `DELETE /medications/{id}`.
- **Blood Pressure (`/blood-pressure`)**: Form to log readings and a table of past logs.
  - **Needs:** `GET /bloodpressure`, `POST /bloodpressure`, `DELETE /bloodpressure/{id}`.
- **Vitals (`/vitals`)**: Form to log vitals and a table of past logs.
  - **Needs:** `GET /vitals`, `POST /vitals`, `DELETE /vitals/{id}`.
- **Family View (`/family`)**: List of family members with Add/Remove functionality.
  - **Needs:** `GET /family`, `POST /family/invite`, `DELETE /family/{id}`.
- **Timeline (`/timeline`)**: Aggregated view of health events.
  - **Needs:** `GET /timeline`.

# 6. Configuration & ENV Vars

- `MONGODB_URI`: Your MongoDB Atlas connection string.

# 7. Testing Strategy

- All testing will be performed manually through the frontend UI.
- Each task includes a **Manual Test Step** describing the action and expected outcome.

# 8. Dynamic Sprint Plan & Backlog

## S0 – Backend Setup

- **Objectives:**
  - Create the FastAPI skeleton.
  - Implement all Pydantic models.
  - Implement all CRUD endpoints for all features.
  - Ensure the final code is correctly structured and runs without errors.

- **Task 1: Create the complete `main.py` file.**
  - **Implementation:** Replace the entire content of `backend/main.py` with the code block below. This single file contains the complete, correct, and final version of the backend.
  - **Manual Test Step:** Run `cd backend && python -m uvicorn main:app --reload`. Open `http://127.0.0.1:8000/docs` in your browser.
  - **Expected Result:** The interactive Swagger documentation loads and displays all API endpoints for symptoms, medications, blood pressure, vitals, family, and timeline.
  - **User Test Prompt:** "Please restart the backend server and open the `/docs` page to confirm all APIs are now visible."

- **Final `main.py` Code:**
  ```python
  import os
  from datetime import datetime
  from typing import List
  from fastapi import FastAPI, HTTPException, Body
  from fastapi.middleware.cors import CORSMiddleware
  from pydantic import BaseModel, Field
  from pymongo import MongoClient
  from pymongo.errors import ConnectionFailure
  from dotenv import load_dotenv
  from bson import ObjectId
  from fastapi.responses import JSONResponse

  # Load environment variables from .env file
  load_dotenv()

  # Initialize FastAPI app
  app = FastAPI()

  # Configure CORS
  origins = [
      "http://localhost:5173", "http://localhost:5139" # Add all possible frontend ports
  ]

  app.add_middleware(
      CORSMiddleware,
      allow_origins=origins,
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )

  # MongoDB connection
  try:
      mongo_uri = os.getenv("MONGODB_URI")
      if not mongo_uri:
          raise ValueError("MONGODB_URI not found in environment variables")
      client = MongoClient(mongo_uri)
      db = client.get_database() 
  except (ConnectionFailure, ValueError) as e:
      client = None
      db = None
      print(f"Error connecting to MongoDB: {e}")

  # --- Pydantic Models ---

  class Symptom(BaseModel):
     id: str | None = None
     date: datetime = Field(default_factory=datetime.utcnow)
     fatigue: int
     nausea: int
     pain: int
     notes: str | None = None

     class Config:
          populate_by_name = True
          json_encoders = {ObjectId: str}

     def __init__(self, **data):
         super().__init__(**data)
         if "_id" in data:
             self.id = str(data["_id"])

  class Medication(BaseModel):
      id: str | None = None
      name: str
      dosage: str
      frequency: str
      notes: str | None = None
   
      class Config:
          populate_by_name = True
          json_encoders = {ObjectId: str}

      def __init__(self, **data):
          super().__init__(**data)
          if "_id" in data:
              self.id = str(data["_id"])
             
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
   
      class Config:
          populate_by_name = True
          json_encoders = {ObjectId: str}

      def __init__(self, **data):
          super().__init__(**data)
          if "_id" in data:
              self.id = str(data["_id"])

  class VitalsLog(BaseModel):
      id: str | None = None
      heart_rate: int
      temperature: float
      oxygen_saturation: int
      date: datetime = Field(default_factory=datetime.utcnow)
      notes: str | None = None
   
      class Config:
          populate_by_name = True
          json_encoders = {ObjectId: str}

      def __init__(self, **data):
          super().__init__(**data)
          if "_id" in data:
              self.id = str(data["_id"])

  class FamilyMemberCreate(BaseModel):
     name: str
     relation: str

  class FamilyMember(BaseModel):
      id: str
      name: str
      relation: str

      class Config:
          populate_by_name = True
          json_encoders = {ObjectId: str}

  # --- API Routes ---

  @app.get("/")
  def read_root():
      return {"Hello": "World"}

  @app.get("/api/v1/healthz")
  def health_check():
      if client and db:
          try:
              client.admin.command('ismaster')
              return {"status": "ok", "message": "Successfully connected to MongoDB"}
          except ConnectionFailure as e:
              raise HTTPException(status_code=503, detail=f"Failed to connect to MongoDB: {e}")
      else:
          raise HTTPException(status_code=503, detail="MongoDB client not initialized")

  @app.get("/api/v1/symptoms", response_model=List[Symptom])
  async def get_symptoms():
      symptoms_collection = db.symptoms
      user_symptoms = symptoms_collection.find()
      return [Symptom(**symptom) for symptom in user_symptoms]

  @app.post("/api/v1/symptoms", response_model=Symptom)
  async def create_symptom(symptom: Symptom = Body(...)):
      symptoms_collection = db.symptoms
      symptom_data = symptom.model_dump(exclude={"id"})
      symptom_data["date"] = datetime.utcnow()
   
      result = symptoms_collection.insert_one(symptom_data)
      created_symptom = symptoms_collection.find_one({"_id": result.inserted_id})
   
      return Symptom(**created_symptom)

  @app.post("/api/v1/medications", response_model=Medication)
  async def create_medication(medication: Medication = Body(...)):
      medications_collection = db.medications
      medication_data = medication.model_dump(exclude={"id"})
   
      result = medications_collection.insert_one(medication_data)
      created_medication = medications_collection.find_one({"_id": result.inserted_id})
   
      return Medication(**created_medication)

  @app.get("/api/v1/medications", response_model=List[Medication])
  async def get_medications():
     medications_collection = db.medications
     user_medications = medications_collection.find()
     return [Medication(**medication) for medication in user_medications]

  @app.put("/api/v1/medications/{med_id}", response_model=Medication)
  async def update_medication(med_id: str, medication: Medication = Body(...)):
      medications_collection = db.medications
      
      existing_medication = medications_collection.find_one({"_id": ObjectId(med_id)})
      
      if existing_medication is None:
          raise HTTPException(status_code=404, detail="Medication not found")
          
      medication_data = medication.model_dump(exclude={"id"})
      medications_collection.update_one(
          {"_id": ObjectId(med_id)}, {"$set": medication_data}
      )
      
      updated_medication = medications_collection.find_one({"_id": ObjectId(med_id)})
      return Medication(**updated_medication)

  @app.delete("/api/v1/medications/{med_id}")
  async def delete_medication(med_id: str):
     medications_collection = db.medications
     
     delete_result = medications_collection.delete_one({"_id": ObjectId(med_id)})
     
     if delete_result.deleted_count == 0:
         raise HTTPException(status_code=404, detail="Medication not found")
         
     return {"message": "Medication deleted successfully"}

  @app.get("/api/v1/timeline", response_model=List[dict])
  async def get_timeline():
     symptoms_collection = db.symptoms
     medications_collection = db.medications

     timeline_events = []

     user_symptoms = symptoms_collection.find()
     for symptom in user_symptoms:
         timeline_events.append(
             TimelineEvent(
                 id=str(symptom["_id"]),
                 date=symptom["date"],
                 type="symptom",
                 title="Symptom Logged",
                 description=f"Fatigue: {symptom['fatigue']}, Nausea: {symptom['nausea']}, Pain: {symptom['pain']}",
             ).model_dump()
         )

     user_medications = medications_collection.find()
     for medication in user_medications:
         timeline_events.append(
             TimelineEvent(
                 id=str(medication["_id"]),
                 date=datetime.utcnow(),
                 type="medication",
                 title=medication["name"],
                 description=f"Dosage: {medication['dosage']}, Frequency: {medication['frequency']}",
             ).model_dump()
         )

     timeline_events.sort(key=lambda x: x['date'], reverse=True)

     return JSONResponse(content=timeline_events)
   
  @app.post("/api/v1/bloodpressure", response_model=BloodPressureLog)
  async def create_blood_pressure_log(log: BloodPressureLog = Body(...)):
      blood_pressure_collection = db.blood_pressure_logs
      log_data = log.model_dump(exclude={"id"})
      log_data["date"] = datetime.utcnow()
   
      result = blood_pressure_collection.insert_one(log_data)
      created_log = blood_pressure_collection.find_one({"_id": result.inserted_id})
   
      return BloodPressureLog(**created_log)
   
  @app.get("/api/v1/bloodpressure", response_model=List[BloodPressureLog])
  async def get_blood_pressure_logs():
     blood_pressure_collection = db.blood_pressure_logs
     user_logs = blood_pressure_collection.find()
     return [BloodPressureLog(**log) for log in user_logs]
   
  @app.delete("/api/v1/bloodpressure/{log_id}")
  async def delete_blood_pressure_log(log_id: str):
     blood_pressure_collection = db.blood_pressure_logs
     
     delete_result = blood_pressure_collection.delete_one({"_id": ObjectId(log_id)})
     
     if delete_result.deleted_count == 0:
         raise HTTPException(status_code=404, detail="Blood pressure log not found")
         
     return {"message": "Blood pressure log deleted successfully"}

  @app.post("/api/v1/vitals", response_model=VitalsLog)
  async def create_vitals_log(log: VitalsLog = Body(...)):
      vitals_collection = db.vitals_logs
      log_data = log.model_dump(exclude={"id"})
      log_data["date"] = datetime.utcnow()
   
      result = vitals_collection.insert_one(log_data)
      created_log = vitals_collection.find_one({"_id": result.inserted_id})
   
      return VitalsLog(**created_log)

  @app.get("/api/v1/vitals", response_model=List[VitalsLog])
  async def get_vitals_logs():
     vitals_collection = db.vitals_logs
     user_logs = vitals_collection.find()
     return [VitalsLog(**log) for log in user_logs]

  @app.delete("/api/v1/vitals/{log_id}")
  async def delete_vitals_log(log_id: str):
     vitals_collection = db.vitals_logs
     
     delete_result = vitals_collection.delete_one({"_id": ObjectId(log_id)})
     
     if delete_result.deleted_count == 0:
         raise HTTPException(status_code=404, detail="Vitals log not found")
         
     return {"message": "Vitals log deleted successfully"}
   
  @app.get("/api/v1/family", response_model=List[FamilyMember])
  async def get_family_members():
     family_collection = db.family_members
     family_members = []
     user_family_members = family_collection.find()

     for member in user_family_members:
         family_members.append(
             FamilyMember(
                 id=str(member["_id"]),
                 name=member["name"],
                 relation=member["relation"],
             )
         )
     return family_members

  @app.post("/api/v1/family/invite", response_model=FamilyMember)
  async def invite_family_member(member: FamilyMemberCreate = Body(...)):
      family_collection = db.family_members
      member_data = member.model_dump()
   
      result = family_collection.insert_one(member_data)
      created_member = family_collection.find_one({"_id": result.inserted_id})
   
      return FamilyMember(
          id=str(created_member["_id"]),
          name=created_member["name"],
          relation=created_member["relation"],
      )

  @app.delete("/api/v1/family/{member_id}")
  async def remove_family_member(member_id: str):
      family_collection = db.family_members
      delete_result = family_collection.delete_one({"_id": ObjectId(member_id)})
   
      if delete_result.deleted_count == 0:
          raise HTTPException(status_code=404, detail="Family member not found")
   
      return {"message": "Family member removed successfully"}
  ```

- **Definition of Done:**
  - The backend server runs without crashing.
  - The Swagger docs at `/docs` are complete and accurate.
  - All frontend features can be successfully used, and the data is correctly persisted in the MongoDB database.