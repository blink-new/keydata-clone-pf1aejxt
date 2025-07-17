import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { usePMSData } from '../../hooks/usePMSData'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Bed,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6']

export function Dashboard() {
  const { data, connections, loading, error, lastSync, refreshData } = usePMSData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const connectedSystems = connections.filter(c => c.status === 'connected').length
  const totalReservations = data?.reservations?.length || 0
  const totalGuests = data?.guests?.length || 0
  const totalRooms = data?.rooms?.length || 0
  const occupiedRooms = data?.rooms?.filter(r => r.status === 'occupied').length || 0
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0

  // Calculate revenue metrics
  const todayRevenue = data?.revenue?.find(r => r.date === new Date().toISOString().split('T')[0])?.totalRevenue || 0
  const yesterdayRevenue = data?.revenue?.find(r => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return r.date === yesterday.toISOString().split('T')[0]
  })?.totalRevenue || 0
  const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0

  // Prepare chart data
  const revenueChartData = data?.revenue?.slice(0, 7).reverse().map(r => ({
    date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: r.totalRevenue,
    rooms: r.roomRevenue,
    fb: r.fbRevenue,
    other: r.otherRevenue
  })) || []

  const occupancyChartData = data?.occupancy?.slice(0, 7).reverse().map(o => ({
    date: new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    occupancy: o.occupancyRate,
    adr: o.adr,
    revpar: o.revpar
  })) || []

  const roomStatusData = [
    { name: 'Occupied', value: occupiedRooms, color: '#2563EB' },
    { name: 'Available', value: totalRooms - occupiedRooms, color: '#10B981' },
    { name: 'Maintenance', value: data?.rooms?.filter(r => r.status === 'maintenance').length || 0, color: '#F59E0B' },
    { name: 'Out of Order', value: data?.rooms?.filter(r => r.status === 'out_of_order').length || 0, color: '#EF4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Real-time insights from your property management systems
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium">
              {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}
            </p>
          </div>
          <Button onClick={refreshData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {connectedSystems > 0 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">
                  {connectedSystems > 0 ? 'Systems Connected' : 'No Active Connections'}
                </p>
                <p className="text-sm text-gray-600">
                  {connectedSystems} of {connections.length} PMS systems active
                </p>
              </div>
            </div>
            <Badge variant={connectedSystems > 0 ? 'default' : 'destructive'}>
              {connectedSystems > 0 ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${todayRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {revenueChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueChange).toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">{occupiedRooms} of {totalRooms} rooms</p>
                <Progress value={occupancyRate} className="mt-2" />
              </div>
              <Bed className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalReservations}</p>
                <p className="text-sm text-gray-600">
                  {data?.reservations?.filter(r => r.status === 'confirmed').length || 0} confirmed
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalGuests}</p>
                <p className="text-sm text-gray-600">
                  {data?.guests?.filter(g => g.vipStatus).length || 0} VIP guests
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (7 Days)</CardTitle>
            <CardDescription>Daily revenue breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Metrics (7 Days)</CardTitle>
            <CardDescription>Occupancy rate, ADR, and RevPAR trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="occupancy" stroke="#2563EB" strokeWidth={2} name="Occupancy %" />
                <Line type="monotone" dataKey="adr" stroke="#F59E0B" strokeWidth={2} name="ADR" />
                <Line type="monotone" dataKey="revpar" stroke="#10B981" strokeWidth={2} name="RevPAR" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Room Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Room Status Distribution</CardTitle>
            <CardDescription>Current status of all rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={roomStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {roomStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reservations</CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.reservations?.slice(0, 5).map((reservation) => {
                const guest = data.guests?.find(g => g.id === reservation.guestId)
                return (
                  <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{guest?.firstName} {guest?.lastName}</p>
                      <p className="text-sm text-gray-600">Room {reservation.roomNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${reservation.totalAmount}</p>
                      <Badge variant={
                        reservation.status === 'confirmed' ? 'default' :
                        reservation.status === 'checked_in' ? 'secondary' :
                        reservation.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {reservation.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                )
              }) || (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No recent reservations</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}