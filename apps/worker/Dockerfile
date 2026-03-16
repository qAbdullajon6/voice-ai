# syntax=docker/dockerfile:1
FROM python:3.11-slim
WORKDIR /app
COPY apps/worker/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY apps/worker/app ./app
ENV PORT=8001
EXPOSE 8001
CMD ["python","-m","uvicorn","app.main:app","--host","0.0.0.0","--port","8001"]
