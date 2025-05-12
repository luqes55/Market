'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
    <div className="max-w-4xl mx-auto p-6">
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
      {/* Botón para regresar al inicio */}
      <div className="mt-6">
        <Link href="/inicio" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Regresar al inicio
        </Link>
      </div>
    </div>
  );
}
