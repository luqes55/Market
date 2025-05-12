from fastapi import FastAPI
from app.routes.productos import router as productos_router
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine

# Crear todas las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productos_router)
