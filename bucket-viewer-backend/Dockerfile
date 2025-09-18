# Use the official AWS Lambda Python 3.12 base image
FROM public.ecr.aws/lambda/python:3.12
# Copy requirements and install dependencies
COPY uv.lock pyproject.toml ${LAMBDA_TASK_ROOT}
RUN pip install uv

# Install dependencies system-wide (no venv needed in containers)
RUN uv pip install --system --no-cache -r <(uv export --format requirements-txt)

# Copy application code into the container
COPY ./src ${LAMBDA_TASK_ROOT}/src


# Specify the Lambda function handler (src.main.handler) 
CMD ["src.api.main.handler"]  