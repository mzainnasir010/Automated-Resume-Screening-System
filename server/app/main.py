"""
FastAPI + Gradio entry point for Hugging Face Spaces.
"""

import os
from dotenv import load_dotenv
from gradio import Server
import spaces

from fastapi.middleware.cors import CORSMiddleware
from app.api import upload, job_description, score

load_dotenv()

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

demo = Server()

demo.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_methods=["*"],
    allow_headers=["*"],
)

demo.include_router(upload.router)
demo.include_router(job_description.router)
demo.include_router(score.router)


@demo.get("/health")
def health():
    return {"status": "ok", "message": "Resume screening backend is running"}


@spaces.GPU
@demo.api(name="zerogpu_probe")
def _zerogpu_probe():
    return "ok"


if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", show_error=True)