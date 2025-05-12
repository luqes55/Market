'use client';

import { useUser } from '@clerk/nextjs';
import { useState, ChangeEvent } from 'react';

export default function PublicarProducto({ onNuevoProducto }: { onNuevoProducto: (producto: any) => void }) {
  const { user } = useUser();
  const [producto, setProducto] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    precio: '',
    imagen_url: '',
    whatsapp: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoProducto = {
      ...producto,
      autor: user?.id, // <-- ID de Clerk
      precio: parseFloat(producto.precio), // Asegurarse que precio sea número
    };

    try {
      console.log(JSON.stringify(nuevoProducto));
      const res = await fetch('http://127.0.0.1:8000/crearProdu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Producto publicado:', data);
      onNuevoProducto(data.producto);

      // Limpiar formulario
      setProducto({
        nombre: '',
        categoria: '',
        descripcion: '',
        precio: '',
        imagen_url: '',
        whatsapp: '',
      });
    } catch (error) {
      console.error('Error al publicar el producto:', error);
    }
  };

  if (!user) return <p className="text-center mt-4">Debes iniciar sesión para publicar.</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Publicar nuevo producto</h2>

      <input
        type="text"
        name="nombre"
        placeholder="Nombre del producto"
        className="w-full p-2 mb-2 border rounded"
        value={producto.nombre}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="categoria"
        placeholder="Categoría"
        className="w-full p-2 mb-2 border rounded"
        value={producto.categoria}
        onChange={handleChange}
        required
      />

      <textarea
        name="descripcion"
        placeholder="Descripción"
        className="w-full p-2 mb-2 border rounded"
        rows={3}
        value={producto.descripcion}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="precio"
        placeholder="Precio (ej: 29.99)"
        className="w-full p-2 mb-2 border rounded"
        value={producto.precio}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="imagen_url"
        placeholder="URL de imagen"
        className="w-full p-2 mb-2 border rounded"
        value={producto.imagen_url}
        onChange={handleChange}
      />

      <input
        type="text"
        name="whatsapp"
        placeholder="Número de WhatsApp"
        className="w-full p-2 mb-4 border rounded"
        value={producto.whatsapp}
        onChange={handleChange}
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Publicar producto
      </button>
    </form>
  );
}
