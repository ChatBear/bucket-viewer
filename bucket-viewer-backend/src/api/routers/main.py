from fastapi import APIRouter 

from src.api.routers.bucket import bucket_router



router = APIRouter() 
router.include_router(bucket_router)


