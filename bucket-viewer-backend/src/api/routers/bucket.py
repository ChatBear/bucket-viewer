from datetime import datetime
from typing import List, Optional

import boto3
from fastapi import APIRouter, Query, status
from pydantic import BaseModel

bucket_router = APIRouter(prefix="/bucket", tags=["bucket"])
client = boto3.client("s3")
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
    contents: Optional[List[S3Object]] = None
    commonPrefixes: Optional[List[CommonPrefix]] = None


@bucket_router.get("", response_model=ListObjectsResponse)
def list_object(prefix: str = Query(default="")):
    # Error handling needed here
    files = {}
    if prefix:
        res = client.list_objects_v2(Bucket=BUCKET_NAME, Delimiter="/", Prefix=prefix)
    else:
        res = client.list_objects_v2(Bucket=BUCKET_NAME, Delimiter="/")
    if "Contents" in res:
        files["contents"] = res["Contents"]
    if "CommonPrefixes" in res:
        files["commonPrefixes"] = res["CommonPrefixes"]

    return files


@bucket_router.delete("")
def delete_object(key_file: str):
    key_file = key_file.replace(",", "/")
    # Error handling needed here
    if key_file:
        res = client.delete_object(Bucket=BUCKET_NAME, Key=key_file)
        print(res)
        if res["ResponseMetadata"]["HTTPStatusCode"] == 204:
            return status.HTTP_204_NO_CONTENT
    else:
        return status.HTTP_400_BAD_REQUEST
