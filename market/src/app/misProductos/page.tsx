
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

  const handleEliminar = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const res = await fetch(`http://localhost:8000/eliminarProdu/${id}`, {
          method: 'DELETE',
        });
  
        if (!res.ok) throw new Error('Error al eliminar');
  
        // Actualiza el estado eliminando el producto
        setProductos(productos.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };
  
  const handleActualizar = (id: string) => {
    // Redirige a una página para editar el producto
    window.location.href = `/actualizarProductos/${id}`; // asegúrate de tener esta ruta
  };
  

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
                className="flex gap-4 items-start p-4  border rounded-md shadow  bg-white"
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
                    {/*<p className="text-sm text-gray-500">Autor: {prod.autor}</p>*/}
                    {/* Botones */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleActualizar(prod.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Actualizar
                      </button>
                      <button
                        onClick={() => handleEliminar(prod.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Eliminar
                      </button>
                      </div>
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
