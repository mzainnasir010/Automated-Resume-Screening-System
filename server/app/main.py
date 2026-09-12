"""
FastAPI + Gradio entry point for Hugging Face Spaces.

The FastAPI application provides the resume screening API routes.
Gradio provides the Space UI and ZeroGPU integration.
"""

import os

from dotenv import load_dotenv
from gradio import Server
import gradio as gr
import spaces

from fastapi.middleware.cors import CORSMiddleware

from app.api import upload, job_description, score


load_dotenv()

FRONTEND_URL = os.environ.get(
    "FRONTEND_URL",
    "http://localhost:3000"
)


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

demo = Server()


demo.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routes
demo.include_router(upload.router)
demo.include_router(job_description.router)
demo.include_router(score.router)


@demo.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Resume screening backend is running"
    }


# --------------------------------------------------
# ZeroGPU function
# --------------------------------------------------

@spaces.GPU
def _zerogpu_probe():
    return "ok"


# --------------------------------------------------
# Gradio UI
# --------------------------------------------------

ui = gr.Blocks()

with ui:
    gr.Markdown(
        "# Resume Screening Backend\n"
        "API only. See `/docs` for endpoints."
    )

    probe_output = gr.Textbox(visible=False)

    ui.load(
        fn=_zerogpu_probe,
        outputs=probe_output
    )


# --------------------------------------------------
# Mount Gradio into FastAPI
# --------------------------------------------------

app = gr.mount_gradio_app(
    demo,
    ui,
    path="/"
)


# --------------------------------------------------
# Hugging Face / ZeroGPU startup
# --------------------------------------------------

if __name__ == "__main__":
    app.launch(
        server_name="0.0.0.0",
        server_port=7860,
        show_error=True
    )