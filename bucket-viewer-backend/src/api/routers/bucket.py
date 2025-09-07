from fastapi import APIRouter

bucket_router = APIRouter(prefix="/bucket/", tags=["bucket"]) 

@bucket_router.get("bucket") 
def list_object():
    pass 


