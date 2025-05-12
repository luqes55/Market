# models.py
from sqlalchemy import Column, Integer, String
from app.database import Base
from pydantic import BaseModel
from typing import Optional

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String)
    precio = Column(Integer)
    imagen_url = Column(String)
    categoria = Column(String)
    autor = Column(String)
    whatsapp = Column(String)

# Esquemas Pydantic
class ProductoCreate(BaseModel):
    nombre: str
    categoria: str
    descripcion: str
    precio: float
    imagen_url: Optional[str] = None
    whatsapp: str
    autor: str


class ProductoOut(BaseModel):
    id: int
    nombre: str
    categoria: str
    descripcion: str
    imagen_url: str
    whatsapp: str
    autor: str

    class Config:
        orm_mode = True
