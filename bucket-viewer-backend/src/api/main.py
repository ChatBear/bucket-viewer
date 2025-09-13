from functools import lru_cache
from typing import Annotated

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from . import config
from .routers.main import router


@lru_cache
def get_settings():
    return config.Settings()


app = FastAPI()
settings = get_settings()
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def hello():
    return {"message": "Hello from FastAPI on AWS Lambda!"}


handler = Mangum(app)
