from fastapi import APIRouter

from .bucket import bucket_router

router = APIRouter()
router.include_router(bucket_router)
