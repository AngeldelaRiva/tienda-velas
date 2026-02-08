'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import products from '../lib/products'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function Home() {
  const { data: session } = useSession()

  const [cart, setCart] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  /* ======================
     🔹 LOCAL STORAGE
  ====================== */
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  /* ======================
     🛒 CARRITO
  ====================== */
  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeOne = (id: string) => {
    setCart(prev =>
      prev
        .map(p =>
          p.id === id ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter(p => p.quantity > 0)
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
    setOpen(false)
  }

  const totalItems = cart.reduce((a, b) => a + b.quantity, 0)
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  /* ======================
     💳 STRIPE CHECKOUT
  ====================== */
  const checkoutStripe = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <>
      {/* ======================
          🧭 NAVBAR
      ====================== */}
      <nav className="fixed top-0 w-full bg-white border-b z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">CandleSuki</div>

          <div className="flex items-center gap-6">
            <a href="#productos" className="hover:underline">
              Productos
            </a>

            {/* 👤 USUARIO */}
            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm font-medium">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm underline"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="text-xl"
                title="Iniciar sesión"
              >
                👤
              </button>
            )}

            {/* 🛒 CARRITO */}
            <button
              onClick={() => setOpen(true)}
              className="relative text-2xl"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ======================
          🕯️ CONTENIDO
      ====================== */}
      <main className="p-6 pt-28">
        <section
          id="productos"
          className="grid md:grid-cols-3 gap-6"
        >
          {products.map(product => (
            <div
              key={product.id}
              className="border rounded-lg p-4"
            >
              <div className="relative w-full h-48 overflow-hidden rounded">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              <h2 className="text-xl font-semibold mt-3">
                {product.name}
              </h2>
              <p className="text-gray-600">
                {product.description}
              </p>
              <p className="font-bold mt-2">
                ${product.price} MXN
              </p>

              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </section>
      </main>

      {/* ======================
          🛒 CARRITO LATERAL
      ====================== */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <aside className="absolute right-0 top-0 h-full w-80 bg-white p-5 shadow-xl">
            <h3 className="font-bold text-lg mb-4">
              Tu carrito
            </h3>

            {cart.length === 0 && (
              <p className="text-gray-500">
                El carrito está vacío
              </p>
            )}

            {cart.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-3"
              >
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ${item.price} × {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeOne(item.id)}
                  className="text-red-500"
                >
                  🗑️
                </button>
              </div>
            ))}

            <div className="border-t pt-3 mt-4 font-bold">
              Total: ${totalPrice} MXN
            </div>

            <button
              onClick={checkoutStripe}
              disabled={cart.length === 0}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Pagar con tarjeta
            </button>

            <button
              onClick={clearCart}
              className="mt-2 w-full bg-red-600 text-white py-2 rounded"
            >
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </>
  )
}