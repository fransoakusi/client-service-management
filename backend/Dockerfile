

# Use Python 3.9 as base image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the backend code to the container
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set PYTHONPATH to fix module import
ENV PYTHONPATH="/app"

# Expose the port Flask runs on
EXPOSE 5001

# Start the Flask app
CMD ["python", "app/main.py"]
