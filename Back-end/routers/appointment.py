from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.appointment import Appointment
from schemas.appointment import AppointmentCreate, AppointmentResponse

router = APIRouter()


@router.post("/appointments", response_model=AppointmentResponse)
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    appointment = Appointment(
        service_type=data.service_type,
        date=data.date,
        time=data.time,
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


@router.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(appointment)
    db.commit()

    return {"message": "Agendamento deletado com sucesso"}