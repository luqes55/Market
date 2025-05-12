'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function DetallesProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/detalles/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(err => console.error('Error al cargar detalles:', err));
  }, [id]);

  if (!producto) {
    return <p className="p-4">Cargando detalles...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 shadow">
       {/* Mostrar información del autor */}
       <div className="mt-4 ml-0  p-2 rounded bg-gray-50  flex flex-col sm:flex-row items-center  gap-2 max-w-sm mx-auto">
          {producto.autor.logo_url && (
            <img
              src={producto.autor.logo_url}
              alt="Autor"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col items-center sm:items-start">
            <p className="font-semibold text-lg text-center sm:text-left">
              {producto.autor.nombre}
            </p>
            <h1 className="text-sm bg-green-600 text-white px-3 py-0 rounded shadow mt-1">
              {producto.autor.rol}
            </h1>
          </div>
        </div>

      {/* Mostrar el resto de la información del producto */}
      <h1 className="text-2xl font-bold mb-4">{producto.nombre}</h1>
      {producto.imagen_url && (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="w-full max-h-96 object-cover rounded mb-4"
        />
      )}
      <p className="text-gray-700 mb-2"><strong>Categoría:</strong> {producto.categoria}</p>
      <p className="text-gray-700 mb-4">{producto.descripcion}</p>
      <a
        href={`https://wa.me/${producto.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Contactar por WhatsApp
      </a>
      
      {/* Botón para ir al inicio */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full px-4 sm:px-0 flex justify-center gap-3 flex-wrap">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition text-sm sm:text-base animate-bounce"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
