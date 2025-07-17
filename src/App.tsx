import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { ConnectionManager } from './components/api/ConnectionManager'
import { usePMSData } from './hooks/usePMSData'
import { Loader2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const { connections } = usePMSData()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading KeyData...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to KeyData</h1>
          <p className="text-gray-600 mb-8">Please sign in to access your analytics dashboard</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const connectedSystems = connections.filter(c => c.status === 'connected').length
  const isConnected = connectedSystems > 0

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'api-connections':
        return <ConnectionManager />
      case 'analytics':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics</h2>
            <p className="text-gray-600">Coming soon - Deep dive analytics and custom reports</p>
          </div>
        )
      case 'reservations':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservations Management</h2>
            <p className="text-gray-600">Coming soon - Detailed reservation tracking and management</p>
          </div>
        )
      case 'guests':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Guest Management</h2>
            <p className="text-gray-600">Coming soon - Guest profiles and history tracking</p>
          </div>
        )
      case 'revenue':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Revenue Analytics</h2>
            <p className="text-gray-600">Coming soon - Detailed revenue analysis and forecasting</p>
          </div>
        )
      case 'data-sources':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sources</h2>
            <p className="text-gray-600">Coming soon - Manage and configure data sources</p>
          </div>
        )
      case 'reports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
            <p className="text-gray-600">Coming soon - Custom reports and scheduled exports</p>
          </div>
        )
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Coming soon - Application settings and preferences</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isConnected={isConnected}
        connectionCount={connections.length}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}

export default App