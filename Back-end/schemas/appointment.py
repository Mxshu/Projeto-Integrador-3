from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    title: str
    date: str
    description: str
    user_id: int


class AppointmentResponse(BaseModel):
    id: int
    title: str
    date: str
    description: str
    user_id: int

    class Config:
        from_attributes = True