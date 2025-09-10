# Use the official AWS Lambda Python 3.12 base image
FROM public.ecr.aws/lambda/python:3.12

# Copy requirements and install dependencies
COPY uv.lock pyproject.toml .python-version ${LAMBDA_TASK_ROOT}
RUN pip install uv
RUN uv sync
# Copy application code into the container
COPY ./src ${LAMBDA_TASK_ROOT}/app

# Specify the Lambda function handler (app.main.handler) 
CMD ["app.api.main.handler"]  