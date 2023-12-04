import sys
from pathlib import Path
from dataclasses import asdict

import cv2
import asyncio
import numpy as np
from fastapi import FastAPI, UploadFile, File, WebSocket

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")


# @app.get("/api/healthchecker")
# def healthchecker():
#     return {"status": "success", "message": "Integrate FastAPI Framework with Next.js"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FILE = Path(__file__).resolve()
# ROOT = FILE.parents[1]
# if str(ROOT) not in sys.path:
#     sys.path.append(str(ROOT))

from juxtapose import RTM

global_config = dict({"det": "rtmdet-m", "tracker": "None", "pose": "rtmpose-m"})
global_model = RTM(
    det=global_config["det"],
    tracker=global_config["tracker"],
    pose=global_config["pose"],
)


@app.get("/api/healthchecker")
def healthchecker():
    return {
        "model": global_model is not None,
        "config": global_config,
        "status": "success",
        "message": "Pose Estimation API is running!",
    }


@app.post("/api/model")
def get_model(
    config: dict = {"det": "rtmdet-m", "tracker": "None", "pose": "rtmpose-m"}
):
    global global_model
    global global_config
    global_config = config
    global_model = None
    global_model = RTM(
        det=config["det"], tracker=config["tracker"], pose=config["pose"]
    )
    return {
        "model": global_model is not None,
        "status": "success",
        "message": "Integrate FastAPI Framework with Next.js",
    }


@app.post("/api/upload")
def upload_file(file: UploadFile = File(...)):
    print(file.filename)
    return {"ok": True}


@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            print("websocket accepted")
            ids = await websocket.receive_text()
            b = await websocket.receive_bytes()
            data = np.frombuffer(b, dtype=np.uint8)
            img = cv2.imdecode(data, 1)
            # print(img.shape)
            output = global_model(img, show=False)[0]  # .model_dump(exclude="im")
            output = {
                k: v.tolist() if isinstance(v, np.ndarray) else v
                for k, v in asdict(output).items()
            }
            output["id"] = ids
            del output["im"]
            # print(output)
            await websocket.send_json(output)
        except Exception as e:
            print(e)
            await websocket.send_json({"success": False})
            # await websocket.send_text(f"Message text was: error")
