import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Alert, AlertDescription } from '../ui/alert'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'
import { PMSConnection } from '../../types/pms'
import { usePMSData } from '../../hooks/usePMSData'
import { CredentialsSetup } from './CredentialsSetup'
import { IntegrationGuide } from './IntegrationGuide'
import {
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Settings,
  Database,
  Wifi,
  AlertTriangle,
  Key
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const PMS_TYPES = [
  { value: 'opera', label: 'Oracle Opera' },
  { value: 'fidelio', label: 'Fidelio Suite8' },
  { value: 'protel', label: 'Protel Air' },
  { value: 'mews', label: 'Mews Commander' },
  { value: 'cloudbeds', label: 'Cloudbeds' },
  { value: 'rms', label: 'RMS Cloud' },
  { value: 'custom', label: 'Custom API' }
]

const SYNC_FREQUENCIES = [
  { value: 'real_time', label: 'Real-time' },
  { value: 'hourly', label: 'Every Hour' },
  { value: 'daily', label: 'Daily' },
  { value: 'manual', label: 'Manual Only' }
]

const AUTH_TYPES = [
  { value: 'api_key', label: 'API Key' },
  { value: 'oauth', label: 'OAuth 2.0' },
  { value: 'basic_auth', label: 'Basic Auth' }
]

export function ConnectionManager() {
  const { connections, loading, syncWithPMS, addConnection, removeConnection } = usePMSData()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newConnection, setNewConnection] = useState<Partial<PMSConnection>>({
    name: '',
    type: 'custom',
    apiEndpoint: '',
    authType: 'api_key',
    syncFrequency: 'hourly',
    status: 'disconnected'
  })
  const [testingConnection, setTestingConnection] = useState<string | null>(null)

  const handleAddConnection = async () => {
    try {
      if (!newConnection.name || !newConnection.apiEndpoint) {
        toast.error('Please fill in all required fields')
        return
      }

      await addConnection(newConnection as Omit<PMSConnection, 'id' | 'lastSync'>)
      toast.success('PMS connection added successfully')
      setShowAddDialog(false)
      setNewConnection({
        name: '',
        type: 'custom',
        apiEndpoint: '',
        authType: 'api_key',
        syncFrequency: 'hourly',
        status: 'disconnected'
      })
    } catch (error) {
      toast.error('Failed to add PMS connection')
    }
  }

  const handleTestConnection = async (connectionId: string) => {
    setTestingConnection(connectionId)
    try {
      await syncWithPMS(connectionId)
      toast.success('Connection test successful')
    } catch (error) {
      toast.error('Connection test failed')
    } finally {
      setTestingConnection(null)
    }
  }

  const handleRemoveConnection = async (connectionId: string) => {
    try {
      await removeConnection(connectionId)
      toast.success('PMS connection removed')
    } catch (error) {
      toast.error('Failed to remove connection')
    }
  }

  const handleCredentialsSet = (connectionId: string) => {
    toast.success('Credentials saved securely')
    // Optionally trigger a connection test here
  }

  const getStatusIcon = (status: PMSConnection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'syncing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: PMSConnection['status']) => {
    switch (status) {
      case 'connected':
        return 'default'
      case 'disconnected':
        return 'destructive'
      case 'error':
        return 'secondary'
      case 'syncing':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Connections</h2>
          <p className="text-gray-600">Manage your PMS integrations and data sources</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add PMS Connection</DialogTitle>
              <DialogDescription>
                Connect your Property Management System to automatically sync data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Connection Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main Hotel PMS"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">PMS Type</Label>
                  <Select
                    value={newConnection.type}
                    onValueChange={(value) => setNewConnection({ ...newConnection, type: value as PMSConnection['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PMS_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  placeholder="https://api.yourpms.com/v1"
                  value={newConnection.apiEndpoint}
                  onChange={(e) => setNewConnection({ ...newConnection, apiEndpoint: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authType">Authentication</Label>
                  <Select
                    value={newConnection.authType}
                    onValueChange={(value) => setNewConnection({ ...newConnection, authType: value as PMSConnection['authType'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTH_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syncFreq">Sync Frequency</Label>
                  <Select
                    value={newConnection.syncFrequency}
                    onValueChange={(value) => setNewConnection({ ...newConnection, syncFrequency: value as PMSConnection['syncFrequency'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SYNC_FREQUENCIES.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  API credentials will be stored securely and encrypted. Make sure your PMS API key has read permissions for reservations, guests, and revenue data.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddConnection}>
                  Add Connection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connection Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active Connections</p>
                <p className="text-2xl font-bold">
                  {connections.filter(c => c.status === 'connected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Sources</p>
                <p className="text-2xl font-bold">{connections.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Auto Sync</p>
                <p className="text-2xl font-bold">
                  {connections.filter(c => c.syncFrequency !== 'manual').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold">
                  {connections.filter(c => c.status === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connections List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Connected Systems</h3>
        {connections.length === 0 ? (
          <IntegrationGuide />
        ) : (
          <div className="grid gap-4">
            {connections.map((connection) => (
              <Card key={connection.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(connection.status)}
                      <div>
                        <CardTitle className="text-lg">{connection.name}</CardTitle>
                        <CardDescription>
                          {PMS_TYPES.find(t => t.value === connection.type)?.label} • 
                          Last sync: {new Date(connection.lastSync).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(connection.status)}>
                        {connection.status}
                      </Badge>
                      <CredentialsSetup 
                        connection={connection}
                        onCredentialsSet={handleCredentialsSet}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(connection.id)}
                        disabled={testingConnection === connection.id}
                        className="gap-2"
                      >
                        {testingConnection === connection.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Sync
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveConnection(connection.id)}
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Endpoint</p>
                      <p className="font-medium truncate">{connection.apiEndpoint}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Auth Type</p>
                      <p className="font-medium">{AUTH_TYPES.find(a => a.value === connection.authType)?.label}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Sync Frequency</p>
                      <p className="font-medium">{SYNC_FREQUENCIES.find(s => s.value === connection.syncFrequency)?.label}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium capitalize">{connection.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}