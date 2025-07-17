export interface PMSConnection {
  id: string
  name: string
  type: 'opera' | 'fidelio' | 'protel' | 'mews' | 'cloudbeds' | 'rms' | 'custom'
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync: string
  apiEndpoint: string
  authType: 'api_key' | 'oauth' | 'basic_auth'
  syncFrequency: 'real_time' | 'hourly' | 'daily' | 'manual'
}

export interface PMSData {
  reservations: Reservation[]
  guests: Guest[]
  rooms: Room[]
  revenue: RevenueData[]
  occupancy: OccupancyData[]
}

export interface Reservation {
  id: string
  guestId: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'
  totalAmount: number
  currency: string
  source: string
  createdAt: string
  updatedAt: string
}

export interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  vipStatus: boolean
  totalStays: number
  totalSpent: number
  lastStay: string
}

export interface Room {
  id: string
  number: string
  type: string
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_order'
  floor: number
  capacity: number
  rate: number
}

export interface RevenueData {
  date: string
  roomRevenue: number
  fbRevenue: number
  otherRevenue: number
  totalRevenue: number
  currency: string
}

export interface OccupancyData {
  date: string
  totalRooms: number
  occupiedRooms: number
  occupancyRate: number
  adr: number
  revpar: number
}

export interface APIEndpoint {
  id: string
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers: Record<string, string>
  dataMapping: Record<string, string>
  isActive: boolean
}