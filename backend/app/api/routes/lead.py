from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.lead import Lead
from app.models.user import User
from app.schemas.lead import LeadCreate
from app.auth.security import get_current_admin


router = APIRouter(
    prefix="/leads",
    tags=["Leads"]
)


# =========================================================
# DATABASE
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# CREATE LEAD
# =========================================================

@router.post("/")
def create_lead(
    lead_data: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    lead = Lead(
        name=lead_data.name,
        phone=lead_data.phone,
        email=lead_data.email,
        company_name=lead_data.company_name,
        source=lead_data.source,
        product_interest=lead_data.product_interest,
        status="new",
        notes=lead_data.notes
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead


# =========================================================
# GET ALL LEADS
# =========================================================

@router.get("/")
def get_leads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    leads = db.query(Lead).all()

    return leads


# =========================================================
# GET SINGLE LEAD
# =========================================================

@router.get("/{lead_id}")
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id
    ).first()

    if lead is None:
        return {
            "message": "Lead not found"
        }

    return lead


# =========================================================
# UPDATE LEAD
# =========================================================

@router.put("/{lead_id}")
def update_lead(
    lead_id: int,
    lead_data: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id
    ).first()

    if lead is None:
        return {
            "message": "Lead not found"
        }

    lead.name = lead_data.name
    lead.phone = lead_data.phone
    lead.email = lead_data.email
    lead.company_name = lead_data.company_name
    lead.source = lead_data.source
    lead.product_interest = lead_data.product_interest
    lead.notes = lead_data.notes

    db.commit()
    db.refresh(lead)

    return lead


# =========================================================
# DELETE LEAD
# =========================================================

@router.delete("/{lead_id}")
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id
    ).first()

    if lead is None:
        return {
            "message": "Lead not found"
        }

    db.delete(lead)
    db.commit()

    return {
        "message": "Lead deleted successfully",
        "lead_id": lead_id
    }


# =========================================================
# UPDATE LEAD STATUS
# =========================================================

@router.put("/{lead_id}/status")
def update_lead_status(
    lead_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id
    ).first()

    if lead is None:
        return {
            "message": "Lead not found"
        }

    allowed_statuses = [
        "new",
        "contacted",
        "interested",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost"
    ]

    if status not in allowed_statuses:
        return {
            "message": "Invalid status",
            "allowed_statuses": allowed_statuses
        }

    lead.status = status

    db.commit()
    db.refresh(lead)

    return {
        "message": "Lead status updated successfully",
        "lead_id": lead.id,
        "status": lead.status
    }


# =========================================================
# SCHEDULE FOLLOW-UP
# =========================================================

@router.put("/{lead_id}/follow-up")
def schedule_follow_up(
    lead_id: int,
    follow_up_date: datetime,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id
    ).first()

    if lead is None:
        return {
            "message": "Lead not found"
        }

    lead.follow_up_date = follow_up_date

    db.commit()
    db.refresh(lead)

    return {
        "message": "Follow-up scheduled successfully",
        "lead_id": lead.id,
        "follow_up_date": lead.follow_up_date
    }

@router.put("/{lead_id}/assign/{user_id}")
def assign_lead(
    lead_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id)
        .first()
    )

    if lead is None:
        return {
            "message": "Lead not found"
        }

    user = (
        db.query(User)
        .filter(
            User.id == user_id,
            User.is_active == True
        )
        .first()
    )

    if user is None:
        return {
            "message": "Active user not found"
        }

    lead.assigned_to = user_id

    db.commit()
    db.refresh(lead)

    return {
        "message": "Lead assigned successfully",
        "lead_id": lead.id,
        "assigned_to": user.id,
        "assigned_user": user.name
    }