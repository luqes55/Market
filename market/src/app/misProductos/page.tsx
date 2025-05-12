
'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function MisProductos() {
  const { user } = useUser()
  interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_url?: string;
    whatsapp?: string;
    categoria: string,
    autor: string,

  }

  const [productos, setProductos] = useState<Producto[]>([])

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/misProductos/${user.id}`)
        .then(res => res.json())
        .then(data => setProductos(data))
    }
  }, [user])

  return (
    
    <div className="container p-4 bg-white border border-black m-2 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Mis Productos</h2>
       

      {productos.length === 0 ? (
        <p>No tienes productos aún.</p>
      ) : (
        <ul className="space-y-4">
            {productos.map(prod => (
                <li
                key={prod.id}
                className="flex gap-4 items-start p-4 border rounded-md shadow  bg-white"
                >
                {/* Imagen */}
                {prod.imagen_url && (
                    <img
                    src={prod.imagen_url}
                    alt={prod.nombre}
                    className="w-32 h-32 object-cover rounded"
                    />
                )}

                {/* Información */}
                <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-bold">{prod.nombre}</h3>
                    <p className="text-gray-700">{prod.descripcion}</p>
                    <p className="text-green-600 font-semibold">Precio: ${prod.precio}</p>
                    <p className="text-sm text-gray-500">WhatsApp: {prod.whatsapp}</p>
                    <p className="text-sm text-gray-500">Categoría: {prod.categoria}</p>
                    <p className="text-sm text-gray-500">Autor: {prod.autor}</p>
                </div>
                </li>
            ))}
            </ul>

      )}

      {/* Botón para ir al inicio */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full px-4 sm:px-0 
          flex justify-center gap-3 flex-wrap">
      <button
          onClick={() => window.location.href = '/'}
          className="bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition text-sm sm:text-base animate-bounce"
        >
          ir al inicio
        </button>
        </div>
    </div>
  )
}
