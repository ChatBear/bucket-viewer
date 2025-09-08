import boto3 

from fastapi import APIRouter
from typing import Optional
from pydantic import BaseModel
from datetime import datetime 
from typing import List

bucket_router = APIRouter(prefix="/bucket", tags=["bucket"]) 
client = boto3.client('s3') 
BUCKET_NAME = "sample-bucket-viewer" 

class S3Object(BaseModel):
    Key: str
    LastModified: datetime
    ETag: str
    ChecksumAlgorithm: List[str]
    ChecksumType: str
    Size: int
    StorageClass: str

class CommonPrefix(BaseModel):
    Prefix: str

class ListObjectsResponse(BaseModel):
    Contents: Optional[List[S3Object]] = None
    CommonPrefixes: Optional[List[CommonPrefix]] = None


@bucket_router.get("", response_model=ListObjectsResponse) 
def list_object(prefix: str | None = ""):
    files = {}
    if prefix: 
        res = client.list_objects_v2(Bucket=BUCKET_NAME, Delimiter='/', Prefix=prefix)
    else:
        res = client.list_objects_v2(Bucket=BUCKET_NAME, Delimiter='/')
    if "Contents" in res:
        files["Contents"] = res["Contents"] 
    if "CommonPrefixes" in res:
        files["CommonPrefixes"] = res["CommonPrefixes"]
    return files 


