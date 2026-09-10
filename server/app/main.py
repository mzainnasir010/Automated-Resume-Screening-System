"""
FastAPI (gradio.Server) entry point. Wires up the API routes and starts the app. Run locally with: python -m app.main
"""

import os
from dotenv import load_dotenv
from gradio import Server
import gradio as gr
from fastapi.middleware.cors import CORSMiddleware
from app.api import upload, job_description, score

load_dotenv()
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

app = Server()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(job_description.router)
app.include_router(score.router)


@app.get("/health")
def health():
    return {"status": "ok", "message": "Resume screening backend is running"}


ui = gr.Blocks()
with ui:
    gr.Markdown("# Resume Screening Backend\nAPI only. See `/docs` for endpoints.")

gr.mount_gradio_app(app, ui, path="/")

if __name__ == "__main__":
    app.launch(server_name="0.0.0.0", server_port=7860)