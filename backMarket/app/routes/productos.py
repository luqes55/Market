from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Producto, ProductoCreate, ProductoOut



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
    db.refresh(nuevo_producto)

    # Retornar el producto como ProductoOut
    return ProductoOut(
    id=nuevo_producto.id,
    nombre=nuevo_producto.nombre,
    descripcion=nuevo_producto.descripcion,
    precio=nuevo_producto.precio,
    imagen_url=nuevo_producto.imagen_url,
    categoria=nuevo_producto.categoria,   # <- agregar esto
    whatsapp=nuevo_producto.whatsapp,     # <- y esto
    autor=nuevo_producto.autor            # <- y esto
)

# Obtener todos los productos
@router.get("/obtenerProdu", response_model=list[ProductoOut])
def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).order_by(Producto.id.desc()).all()  # Ordenamos por fecha_creacion descendente
    return productos


@router.get("/detalles/{producto_id}")
def obtener_detalles(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto