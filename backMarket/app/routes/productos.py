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
    
@router.put("/actualizarProdu/{producto_id}", response_model=ProductoOut)
def actualizar_producto(producto_id: int, producto: ProductoCreate, db: Session = Depends(get_db)):
    # Buscar el producto en la base de datos
    producto_db = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Actualizar los campos del producto
    producto_db.nombre = producto.nombre
    producto_db.categoria = producto.categoria
    producto_db.descripcion = producto.descripcion
    producto_db.precio = producto.precio
    producto_db.imagen_url = producto.imagen_url
    producto_db.whatsapp = producto.whatsapp
    producto_db.autor = producto.autor

    db.commit()
    db.refresh(producto_db)

    return ProductoOut(
        id=producto_db.id,
        nombre=producto_db.nombre,
        descripcion=producto_db.descripcion,
        precio=producto_db.precio,
        imagen_url=producto_db.imagen_url,
        categoria=producto_db.categoria,
        whatsapp=producto_db.whatsapp,
        autor=producto_db.autor
    )

# Obtener todos los productos
@router.get("/obtenerProdu", response_model=list[ProductoOut])
def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).order_by(Producto.id.desc()).all() 
    return productos

@router.get("/producto/{producto_id}", response_model=ProductoOut)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto



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
    
@router.delete("/eliminarProdu/{producto_id}")
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    # Buscar el producto en la base de datos
    producto_db = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Eliminar el producto
    db.delete(producto_db)
    db.commit()

    return {"message": "Producto eliminado correctamente"}

@router.get("/productosPorCategoria/{categoria}", response_model=List[ProductoOut])
def porCategoria(categoria: str, db: Session = Depends(get_db)):
    productos = db.query(Producto).filter(Producto.categoria == categoria).all()
    if not productos:
        raise HTTPException(status_code=404, detail="No se encontraron productos en esta categoría")
    
    return productos

@router.get("/buscar/{query}", response_model=List[ProductoOut])
def buscar_producto(query: str, db: Session = Depends(get_db)):
    productos = db.query(Producto).filter(
        (Producto.nombre.ilike(f"%{query}%")) | 
        (Producto.descripcion.ilike(f"%{query}%"))|
        (Producto.categoria.ilike(f"%{query}%")) 
    ).all()
    
    if not productos:
        raise HTTPException(status_code=404, detail="No se encontraron productos")

    return productos
