from fastapi import FastAPI
from database import engine, Base
from models import user
from routers import user as user_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router.router)


@app.get("/")
def read_root():
    return {"message": "Backend funcionando 🚀"}