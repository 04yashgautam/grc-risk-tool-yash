# i have wrote all the code in a single [app.py] for the simplicity of the assessment, though i could organize and make separate directories for the same
# -------------------------------------------------------------------------------------------------------------------------------------------------------

# imports
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import or_
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
from dotenv import load_dotenv

# dotenv config
load_dotenv()

# db connection
SQLALCHEMY_DATABASE_URL = "sqlite:///./risks.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# db model
Base = declarative_base()

# model
class RiskModel(Base):
    __tablename__ = "risks"
    id = Column(Integer, primary_key=True, index=True)
    asset = Column(String, index=True)
    threat = Column(String)
    likelihood = Column(Integer)
    impact = Column(Integer)
    score = Column(Integer)
    level = Column(String)
    mitigation = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# create tables on startup
Base.metadata.create_all(bind=engine)

# pydantic schema for input
class RiskInput(BaseModel):
    asset: str
    threat: str
    likelihood: int = Field(..., ge=1, le=5)
    impact: int = Field(..., ge=1, le=5)

# pydantic schema for output
class RiskOutput(RiskInput):
    id: int
    score: int
    level: str
    mitigation: str
    created_at: datetime

    class Config:
        from_attributes = True

# app init
app = FastAPI()

# origins
origins = [
    os.getenv("FRONTEND_URL_PROD"),
    os.getenv("FRONTEND_URL_LOCAL")
]

# cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# risk level
def calculate_risk_level(score: int) -> str:
    if score <= 5: return "Low"
    if score <= 12: return "Medium"
    if score <= 18: return "High"
    return "Critical"

# mititgation
def get_mitigation_hint(level: str) -> str:
    if level == "Low": return "Accept / monitor"
    if level == "Medium": return "Plan mitigation within 6 months"
    if level == "High": return "Prioritize action + compensating controls"
    if level == "Critical": return "Immediate mitigation required"
    return ""

# route /assess-risk
@app.post("/assess-risk", response_model=RiskOutput)
def assess_risk(risk: RiskInput, db: Session = Depends(get_db)):
    
    # error handle
    if not (1 <= risk.likelihood <= 5) or not (1 <= risk.impact <= 5):
        raise HTTPException(
            status_code=400, 
            detail="Invalid range: Likelihood and Impact must be 1–5."
        )

    # business logic
    score = risk.likelihood * risk.impact 
    level = calculate_risk_level(score)   
    mitigation = get_mitigation_hint(level)

    # create entry
    new_risk = RiskModel(
        asset=risk.asset,
        threat=risk.threat,
        likelihood=risk.likelihood,
        impact=risk.impact,
        score=score,
        level=level,
        mitigation=mitigation,
        created_at=datetime.now(timezone.utc)
    )
    
    # new entry
    db.add(new_risk)
    db.commit()
    db.refresh(new_risk)

    return new_risk

# route /risks
@app.get("/risks", response_model=List[RiskOutput])
def get_risks(level: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    
    query = db.query(RiskModel)
    
    # level filter
    if level:
        query = query.filter(RiskModel.level.ilike(level))

    # search filter
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                RiskModel.asset.ilike(search_fmt),
                RiskModel.threat.ilike(search_fmt)
            )
        )
        
    return query.all()