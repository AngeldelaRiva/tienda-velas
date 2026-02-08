import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // ❌ Sin sesión
  if (!session) {
    redirect('/')
  }

  // ❌ No admin
  if (session.user.role !== 'admin') {
    redirect('/')
  }

  // ✅ Admin
  return (
    <main className="p-10">
      <div className="flex justify-end mb-6">
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold mb-6">
        Panel de Administración
      </h1>

      <div className="grid gap-4">
        <div className="border p-4 rounded">
          📦 Ver pedidos
        </div>

        <div className="border p-4 rounded">
          💰 Ventas totales
        </div>
      </div>
    </main>
  )
}