from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Producto, ProductoCreate, ProductoOut
from typing import List
import requests
import os
from app.clerk import CLERK_API_KEY

router = APIRouter(prefix="/productos", tags=["Productos"])


router = APIRouter()

@router.post("/crearProdu", response_model=ProductoOut)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    # Crear el producto en la base de datos
    nuevo_producto = Producto(
        nombre=producto.nombre,
        categoria=producto.categoria,
        descripcion=producto.descripcion,
        precio=producto.precio,
        imagen_url=producto.imagen_url,
        whatsapp=producto.whatsapp,
        autor=producto.autor
    )
    db.add(nuevo_producto)
    db.commit()
    print(nuevo_producto)
    db.refresh(nuevo_producto)

    # Retornar el producto como ProductoOut
    return ProductoOut(
    id=nuevo_producto.id,
    nombre=nuevo_producto.nombre,
    descripcion=nuevo_producto.descripcion,
    precio=nuevo_producto.precio,
    imagen_url=nuevo_producto.imagen_url,
    categoria=nuevo_producto.categoria,   
    whatsapp=nuevo_producto.whatsapp,     
    autor=nuevo_producto.autor            
)

# Obtener todos los productos
@router.get("/obtenerProdu", response_model=list[ProductoOut])
def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).order_by(Producto.id.desc()).all() 
    return productos


@router.get("/misProductos/{autor}", response_model=List[ProductoOut])
def obtener_productos_por_autor(autor: str, db: Session = Depends(get_db)):
    productos = db.query(Producto).filter(Producto.autor == autor).all()
    return productos


def datosAutor(clerk_user_id: str):
     
    headers = {
        "Authorization": f"Bearer {CLERK_API_KEY}"
    }
    url = f"https://api.clerk.com/v1/users/{clerk_user_id}"
    response = requests.get(url, headers=headers, verify=False)

    if response.status_code != 200:
        return {"nombre": "Desconocido", "logo_url": None, "rol": "Desconocido"}
    
   
    data = response.json()
    
    return {
        "nombre": f"{data.get('first_name', '')} {data.get('last_name', '')}".strip(),
        "logo_url": data.get("image_url"),
        "rol": data.get("public_metadata", {}).get("public_metadata", {}).get("rol", "Desconocido"),

    }

@router.get("/detalles/{producto_id}")
def obtener_detalles(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    autor_info = datosAutor(producto.autor)

    return {
        "id": producto.id,
        "nombre": producto.nombre,
        "descripcion": producto.descripcion,
        "precio": producto.precio,
        "imagen_url": producto.imagen_url,
        "categoria": producto.categoria,
        "whatsapp": producto.whatsapp,
        "autor": autor_info
    }