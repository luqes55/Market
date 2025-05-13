'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

import Link from 'next/link';

export default function Inicio() {
  const { user } = useUser();
  const [posts, setPosts] = useState<{ id: string; imagen_url?: string; nombre: string; categoria?: string; descripcion: string; whatsapp: string }[]>([]);
  

  useEffect(() => {
    fetch('http://127.0.0.1:8000/obtenerProdu')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error al obtener los productos:', err));
  }, []);

  const handleNuevoProducto = (nuevoProducto: any) => {
    setPosts((prevPosts) => [nuevoProducto, ...prevPosts]);
    
  };

  return (
    <div>
      

      <div className="container p-4 bg-white border border-black m-2 rounded-lg shadow-md max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Inicio</h1>
        <p className="mb-4">Esta es la página de inicio.</p>

        {/* Botón para abrir modal */}
        {user && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full px-4 sm:px-0 
          flex justify-center gap-3 flex-wrap">
          {/* Botón para ir al inicio */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gray-500 text-white px-5 py-3 rounded-full shadow-lg
             hover:bg-gray-600 transition text-sm sm:text-base"
          >
            Inicio
          </button>
          {/* Botón para publicar */}
          <Link
          href="/publicar"
          className="bg-blue-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-600 transition text-sm sm:text-base text-center"
        >
          Publicar producto
        </Link>


          {/* Botón para ir a Mis Productos */}
          <button
          onClick={() => window.location.href = '/misProductos'}
          className="bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition text-sm sm:text-base animate-bounce"
        >
          Mis productos
        </button>

        
          
        </div>
        
        
        )}

        

        {/* Cards */}
       
        <div className="space-y-4 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.length > 0 ? (
                  posts
                    .filter((post: any) => post && post.id) // <- evita errores
                    .map((post: any) => (
                      <div key={post.id} className="cursor-pointer border p-4 rounded-lg shadow bg-white hover:shadow-lg transition">
                        <Link href={`/detalles/${post.id}`}>
                          <div>
                            {post.imagen_url && (
                              <img
                                src={post.imagen_url}
                                alt={post.nombre}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                              />
                            )}
                            <h2 className="text-xl font-bold">{post.nombre}</h2>
                            <p className="text-sm text-gray-500 mb-1">Categoría: {post.categoria || 'Sin categoría'}</p>
                            <p className="mb-2">{post.descripcion}</p>
                          </div>
                        </Link>

                        <div className="flex justify-between items-center mt-4">
                          
                          <a
                            href={`https://wa.me/${post.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            WhatsApp
                          </a>
                          
                        </div>
                    </div>

                      ))
                    ) : (
                      <p className="text-gray-600">No hay publicaciones aún.</p>
                    )}
        </div>
      </div>
    </div>
    
  );
}
