import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

/**
 * Layout principal de l'espace d'administration
 * 
 * Structure :
 * - Sidebar (navigation)
 * - Header (user info + actions)
 * - Main content (Outlet pour les pages)
 */
export function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Container */}
      <div className="lg:pl-64">
        {/* Header */}
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Content */}
        <main className="p-4 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}