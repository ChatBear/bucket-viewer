import boto3 
from fastapi import FastAPI

from src.api.routers.main import router 

app = FastAPI() 
app.include_router(router)

def main():
    print("Hello from bucket-viewer-backend!")


if __name__ == "__main__":
    main()
