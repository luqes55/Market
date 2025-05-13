'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Redirige automáticamente al inicio si el input está vacío
  useEffect(() => {
    if (query.trim() === '') {
      router.push('/');
    }
  }, [query, router]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return; // No hace nada si está vacío (ya redirige solo)
    router.push(`/resultados?query=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="flex justify-between p-4 border border-black m-2 rounded-lg">
      <span>Hola que hace</span>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          className="border border-gray-300 rounded p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </form>

      <UserButton afterSignOutUrl="/inicio" />
    </nav>
  );
}
