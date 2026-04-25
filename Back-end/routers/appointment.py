from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.appointment import Appointment
from schemas.appointment import AppointmentCreate, AppointmentResponse

router = APIRouter()


@router.post("/appointments", response_model=AppointmentResponse)
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    appointment = Appointment(
        title=data.title,
        date=data.date,
        description=data.description,
        user_id=data.user_id
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment


@router.get("/appointments/{user_id}")
def get_appointments(user_id: int, db: Session = Depends(get_db)):
    return db.query(Appointment).filter(Appointment.user_id == user_id).all()