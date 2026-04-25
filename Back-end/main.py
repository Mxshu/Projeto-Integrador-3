from fastapi import FastAPI
from database import engine, Base

from models import user, appointment

from routers import user as user_router
from routers import login
from routers import appointment as appointment_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user_router.router)
app.include_router(login.router)
app.include_router(appointment_router.router)


@app.get("/")
def read_root():
    return {"message": "Backend funcionando 🚀"}