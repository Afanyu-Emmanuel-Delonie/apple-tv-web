import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar.jsx'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[color:var(--color-page)] text-[color:var(--color-ink-800)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <Outlet />
      </main>
    </div>
  )
}
