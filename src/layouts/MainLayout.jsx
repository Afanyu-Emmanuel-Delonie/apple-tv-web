import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[color:var(--color-page)] text-[color:var(--color-ink-800)]">
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
