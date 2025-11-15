import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from db import Database, get_db, close_db  # <-- This line is fixed

app = FastAPI()

# --- CORS Middleware ---
origins = [
    "http://localhost:3000",
    os.environ.get("FRONTEND_URL", "http://localhost:3000")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoint ---
@app.get("/api/v1/graph")
def get_graph_data(db: Database = Depends(get_db)):
    """
    Get all nodes and relationships from the Neo4j database.
    """
    graph_data = db.get_graph_data()
    return graph_data

@app.on_event("shutdown")
def shutdown_event():
    close_db()