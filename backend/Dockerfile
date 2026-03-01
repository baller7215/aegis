FROM python:3.11-slim

WORKDIR /app

# install CPU-only PyTorch first (~200MB vs ~5GB with CUDA)
# sentence-transformers will use this and skip pulling CUDA deps
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
