'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  whatsapp: string;
}

export default function ResultadosPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/buscar/${encodeURIComponent(query)}`);

        if (!res.ok) {
          throw new Error('No se encontraron productos');
        }

        const data = await res.json();
        setProductos(data);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Error al buscar productos');
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto p-1">
      <h1 className="text-2xl font-bold mb-4">Resultados de búsqueda</h1>

      {loading && <p>Cargando productos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && productos.length === 0 && !error && <p>No se encontraron productos.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white rounded-3xl p-2 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            {/* Parte clickeable (Link) */}
            <Link href={`/detalles/${producto.id}`} className="block">
            {producto.imagen_url && (
                <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover mb-3 rounded-2xl border border-gray-200"
                />
                )}

              <h2 className="text-lg md:text-xl font-bold text-gray-800">{producto.nombre}</h2>
              <p className="text-sm text-gray-600 mb-1 line-clamp-2">{producto.descripcion}</p>
              <p className="text-green-600 font-bold text-lg">${producto.precio}</p>
              <p className="text-xs text-gray-500">Categoría: {producto.categoria}</p>
            </Link>

            {/* Botón de WhatsApp (fuera del Link) */}
            <div className="flex justify-end mt-4">
              <a
                href={`https://wa.me/${producto.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors text-sm"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

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
