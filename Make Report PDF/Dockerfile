# Use a lightweight Python base image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy the rest of your application code
COPY . .

# Set default environment variables (can be overridden at runtime)
ENV MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ \
    MONGO_DB_NAME=student_reports \
    PORT=7860

# Expose the port that Gunicorn will run on
EXPOSE ${PORT}

# Command to run the Flask application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "app:app", "--timeout", "120"]