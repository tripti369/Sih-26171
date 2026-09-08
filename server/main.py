from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import re

app = FastAPI(title="Privacy Vision Agent Server")


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class AnalyzeRequest(BaseModel):
    task: str
    image: str


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "status": "Privacy Vision Agent server is running",
        "message": "Server is ready"
    }


# --------------------------------------------------
# ANALYZE ENDPOINT
# --------------------------------------------------

@app.post("/analyze")
def analyze(request: AnalyzeRequest):

    task = request.task.strip().lower()

    print("\n==============================")
    print("REQUEST RECEIVED")
    print("==============================")

    print("Task:", request.task)

    # Check that an image was actually received
    image_received = bool(request.image)

    print("Sanitized image received:", image_received)

    if image_received:
        print(
            "Image size:",
            round(len(request.image) / 1024, 2),
            "KB"
        )

    # --------------------------------------------------
    # DEMO AGENT LOGIC
    # --------------------------------------------------
    #
    # For our prototype we support common browser tasks.
    # The important point is:
    #
    # sanitized screenshot + task
    #            ↓
    #          server
    #            ↓
    #       action JSON
    #
    # Later this logic can be replaced by a real VLM/LLM.
    # --------------------------------------------------

    if "submit" in task:

        action = "click"
        target = "submit"
        confidence = 0.98

    elif "click" in task:

        action = "click"
        target = "submit"
        confidence = 0.85

    else:

        action = "none"
        target = "unknown"
        confidence = 0.50


    result = {
        "success": True,
        "action": action,
        "target": target,
        "confidence": confidence,
        "message": "Action generated from sanitized screen"
    }

    print("Action:", action)
    print("Target:", target)
    print("Confidence:", confidence)

    print("==============================\n")

    return result


# --------------------------------------------------
# TEST ENDPOINT
# --------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "ok",
        "server": "Privacy Vision Agent"
    }