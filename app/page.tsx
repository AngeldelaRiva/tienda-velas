"use client";

import Image from "next/image";
import { useState } from "react";
import { products } from "@/lib/products";

export default function Home() {
  const [cart, setCart] = useState(0);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🕯️ Tienda de Velas Aromáticas
        </h1>
        <div className="text-lg font-semibold">
          Carrito: <span className="text-black">{cart}</span>
        </div>
      </header>

      {/* PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            {/* CONTENEDOR DE IMAGEN */}
            <div className="w-full h-[220px] relative mb-4 overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>

            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="font-bold mt-4">${product.price} MXN</p>

            <button
              onClick={() => setCart(cart + 1)}
              className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}