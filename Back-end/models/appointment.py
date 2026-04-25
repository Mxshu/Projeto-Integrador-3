from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    service_type = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    description = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))