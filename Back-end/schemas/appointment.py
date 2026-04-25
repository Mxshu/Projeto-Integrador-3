from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    service_type: str
    date: str
    time: str
    description: str
    user_id: int


class AppointmentResponse(BaseModel):
    id: int
    service_type: str
    date: str
    time: str
    description: str
    user_id: int

    class Config:
        from_attributes = True