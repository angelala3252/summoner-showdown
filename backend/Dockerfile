# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory
WORKDIR /summoner-showdown

# Copy everything into the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the Flask port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Start the app
CMD ["python", "app.py"]
