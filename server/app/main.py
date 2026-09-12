"""
FastAPI (gradio.Server) entry point. Wires up the API routes.
Hugging Face Spaces (Gradio SDK) imports this file and launches
the `demo` object itself, so there is no manual launch call here.
"""

import os
from dotenv import load_dotenv
from gradio import Server
import gradio as gr
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
def _zerogpu_probe():
    return "ok"

ui = gr.Blocks()
with ui:
    gr.Markdown("# Resume Screening Backend\nAPI only. See `/docs` for endpoints.")
    probe_output = gr.Textbox(visible=False)
    ui.load(fn=_zerogpu_probe, outputs=probe_output)

gr.mount_gradio_app(demo, ui, path="/")

def _zerogpu_startup():
    try:
        from spaces.zero import startup as zero_startup
        zero_startup()
        print("zerogpu: startup report sent", flush=True)
    except ImportError:
        pass
    except Exception as e:
        print(f"[zerogpu] startup report failed: {e}", flush=True)


if __name__ == "__main__":
    _zerogpu_startup()

