// app/actualizarProdutos/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ActualizarProductoPage() {
  const { id } = useParams()
  const router = useRouter()

  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
    imagen_url: '',
    whatsapp: '',
    autor: ''
  })

  useEffect(() => {
    fetch(`http://localhost:8000/producto/${id}`)
      .then(res => res.json())
      .then(data => {
        setProducto({
          nombre: data.nombre,
          descripcion: data.descripcion,
          categoria: data.categoria,
          precio: data.precio,
          imagen_url: data.imagen_url,
          whatsapp: data.whatsapp,
          autor: data.autor
        })
      })
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProducto({ ...producto, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(`http://localhost:8000/actualizarProdu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto)
    })

    if (res.ok) {
      router.push('/misProductos') // o a donde quieras redirigir
      
    } else {
      alert('Error al actualizar el producto')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-black mt-6 rounded">
      <h1 className="text-2xl font-bold mb-4">Actualizar Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 border" />
        <input type="text" name="descripcion" value={producto.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border" />
        <input type="text" name="categoria" value={producto.categoria} onChange={handleChange} placeholder="Categoría" className="w-full p-2 border" />
        <input type="number" name="precio" value={producto.precio} onChange={handleChange} placeholder="Precio" className="w-full p-2 border" />
        <input type="text" name="imagen_url" value={producto.imagen_url} onChange={handleChange} placeholder="URL Imagen" className="w-full p-2 border" />
        <input type="text" name="whatsapp" value={producto.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="w-full p-2 border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar Cambios</button>
      </form>
    </div>
  )
}
