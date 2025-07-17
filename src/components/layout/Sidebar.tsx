import { useState } from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import {
  BarChart3,
  Database,
  Settings,
  FileText,
  Wifi,
  WifiOff,
  Users,
  Calendar,
  DollarSign,
  Home,
  Plug,
  Activity
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isConnected: boolean
  connectionCount: number
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reservations', label: 'Reservations', icon: Calendar },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'data-sources', label: 'Data Sources', icon: Database },
  { id: 'api-connections', label: 'API Connections', icon: Plug },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export function Sidebar({ activeTab, onTabChange, isConnected, connectionCount }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      'flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">KeyData</h1>
              <p className="text-sm text-gray-500">Analytics Platform</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          {!collapsed && (
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
                  {connectionCount} PMS
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {isConnected ? 'Data syncing' : 'No active connections'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-10',
                  collapsed && 'px-2',
                  isActive && 'bg-blue-600 text-white hover:bg-blue-700'
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {item.id === 'api-connections' && !collapsed && connectionCount > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {connectionCount}
                  </Badge>
                )}
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-500" />
          {!collapsed && (
            <div className="flex-1">
              <p className="text-xs text-gray-500">System Status</p>
              <p className="text-sm font-medium text-green-600">All Systems Operational</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}