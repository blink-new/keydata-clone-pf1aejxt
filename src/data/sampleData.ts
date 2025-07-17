import { PMSConnection, PMSData } from '../types/pms'

export const sampleConnections: PMSConnection[] = [
  {
    id: 'conn_1',
    name: 'Main Hotel Opera PMS',
    type: 'opera',
    status: 'connected',
    lastSync: new Date().toISOString(),
    apiEndpoint: 'https://api.opera.example.com/v1',
    authType: 'api_key',
    syncFrequency: 'hourly'
  },
  {
    id: 'conn_2',
    name: 'Resort Mews System',
    type: 'mews',
    status: 'connected',
    lastSync: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    apiEndpoint: 'https://api.mews.com/v1',
    authType: 'oauth',
    syncFrequency: 'real_time'
  },
  {
    id: 'conn_3',
    name: 'Boutique Hotel Custom API',
    type: 'custom',
    status: 'error',
    lastSync: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    apiEndpoint: 'https://api.boutique-hotel.com/pms',
    authType: 'basic_auth',
    syncFrequency: 'daily'
  }
]

export const samplePMSData: PMSData = {
  reservations: [
    {
      id: 'res_1',
      guestId: 'guest_1',
      roomNumber: '101',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      status: 'confirmed',
      totalAmount: 450.00,
      currency: 'USD',
      source: 'Booking.com',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'res_2',
      guestId: 'guest_2',
      roomNumber: '205',
      checkIn: '2024-01-16',
      checkOut: '2024-01-20',
      status: 'checked_in',
      totalAmount: 680.00,
      currency: 'USD',
      source: 'Direct',
      createdAt: '2024-01-12T14:30:00Z',
      updatedAt: '2024-01-16T15:00:00Z'
    },
    {
      id: 'res_3',
      guestId: 'guest_3',
      roomNumber: '312',
      checkIn: '2024-01-14',
      checkOut: '2024-01-16',
      status: 'checked_out',
      totalAmount: 320.00,
      currency: 'USD',
      source: 'Expedia',
      createdAt: '2024-01-08T09:15:00Z',
      updatedAt: '2024-01-16T11:00:00Z'
    },
    {
      id: 'res_4',
      guestId: 'guest_4',
      roomNumber: '408',
      checkIn: '2024-01-17',
      checkOut: '2024-01-19',
      status: 'confirmed',
      totalAmount: 380.00,
      currency: 'USD',
      source: 'Airbnb',
      createdAt: '2024-01-13T16:45:00Z',
      updatedAt: '2024-01-13T16:45:00Z'
    },
    {
      id: 'res_5',
      guestId: 'guest_5',
      roomNumber: '501',
      checkIn: '2024-01-18',
      checkOut: '2024-01-22',
      status: 'confirmed',
      totalAmount: 720.00,
      currency: 'USD',
      source: 'Direct',
      createdAt: '2024-01-14T11:20:00Z',
      updatedAt: '2024-01-14T11:20:00Z'
    }
  ],
  guests: [
    {
      id: 'guest_1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      nationality: 'US',
      vipStatus: false,
      totalStays: 3,
      totalSpent: 1250.00,
      lastStay: '2024-01-18'
    },
    {
      id: 'guest_2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-0456',
      nationality: 'CA',
      vipStatus: true,
      totalStays: 8,
      totalSpent: 4200.00,
      lastStay: '2024-01-20'
    },
    {
      id: 'guest_3',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'mike.brown@email.com',
      phone: '+44-20-7946-0958',
      nationality: 'UK',
      vipStatus: false,
      totalStays: 1,
      totalSpent: 320.00,
      lastStay: '2024-01-16'
    },
    {
      id: 'guest_4',
      firstName: 'Emma',
      lastName: 'Davis',
      email: 'emma.davis@email.com',
      phone: '+33-1-42-86-83-26',
      nationality: 'FR',
      vipStatus: false,
      totalStays: 2,
      totalSpent: 760.00,
      lastStay: '2024-01-19'
    },
    {
      id: 'guest_5',
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@email.com',
      phone: '+1-555-0789',
      nationality: 'US',
      vipStatus: true,
      totalStays: 12,
      totalSpent: 8900.00,
      lastStay: '2024-01-22'
    }
  ],
  rooms: [
    { id: 'room_1', number: '101', type: 'Standard', status: 'available', floor: 1, capacity: 2, rate: 150 },
    { id: 'room_2', number: '102', type: 'Standard', status: 'occupied', floor: 1, capacity: 2, rate: 150 },
    { id: 'room_3', number: '201', type: 'Deluxe', status: 'occupied', floor: 2, capacity: 3, rate: 200 },
    { id: 'room_4', number: '202', type: 'Deluxe', status: 'available', floor: 2, capacity: 3, rate: 200 },
    { id: 'room_5', number: '205', type: 'Deluxe', status: 'occupied', floor: 2, capacity: 3, rate: 200 },
    { id: 'room_6', number: '301', type: 'Suite', status: 'available', floor: 3, capacity: 4, rate: 300 },
    { id: 'room_7', number: '312', type: 'Suite', status: 'maintenance', floor: 3, capacity: 4, rate: 300 },
    { id: 'room_8', number: '401', type: 'Premium', status: 'available', floor: 4, capacity: 2, rate: 250 },
    { id: 'room_9', number: '408', type: 'Premium', status: 'occupied', floor: 4, capacity: 2, rate: 250 },
    { id: 'room_10', number: '501', type: 'Penthouse', status: 'occupied', floor: 5, capacity: 6, rate: 500 },
    { id: 'room_11', number: '502', type: 'Penthouse', status: 'out_of_order', floor: 5, capacity: 6, rate: 500 },
    { id: 'room_12', number: '103', type: 'Standard', status: 'available', floor: 1, capacity: 2, rate: 150 }
  ],
  revenue: [
    {
      date: '2024-01-16',
      roomRevenue: 2400,
      fbRevenue: 800,
      otherRevenue: 200,
      totalRevenue: 3400,
      currency: 'USD'
    },
    {
      date: '2024-01-15',
      roomRevenue: 2200,
      fbRevenue: 750,
      otherRevenue: 150,
      totalRevenue: 3100,
      currency: 'USD'
    },
    {
      date: '2024-01-14',
      roomRevenue: 2600,
      fbRevenue: 900,
      otherRevenue: 300,
      totalRevenue: 3800,
      currency: 'USD'
    },
    {
      date: '2024-01-13',
      roomRevenue: 2100,
      fbRevenue: 650,
      otherRevenue: 100,
      totalRevenue: 2850,
      currency: 'USD'
    },
    {
      date: '2024-01-12',
      roomRevenue: 2800,
      fbRevenue: 950,
      otherRevenue: 250,
      totalRevenue: 4000,
      currency: 'USD'
    },
    {
      date: '2024-01-11',
      roomRevenue: 2300,
      fbRevenue: 700,
      otherRevenue: 180,
      totalRevenue: 3180,
      currency: 'USD'
    },
    {
      date: '2024-01-10',
      roomRevenue: 2500,
      fbRevenue: 820,
      otherRevenue: 220,
      totalRevenue: 3540,
      currency: 'USD'
    }
  ],
  occupancy: [
    {
      date: '2024-01-16',
      totalRooms: 12,
      occupiedRooms: 8,
      occupancyRate: 66.7,
      adr: 225,
      revpar: 150
    },
    {
      date: '2024-01-15',
      totalRooms: 12,
      occupiedRooms: 7,
      occupancyRate: 58.3,
      adr: 210,
      revpar: 122.5
    },
    {
      date: '2024-01-14',
      totalRooms: 12,
      occupiedRooms: 9,
      occupancyRate: 75.0,
      adr: 240,
      revpar: 180
    },
    {
      date: '2024-01-13',
      totalRooms: 12,
      occupiedRooms: 6,
      occupancyRate: 50.0,
      adr: 195,
      revpar: 97.5
    },
    {
      date: '2024-01-12',
      totalRooms: 12,
      occupiedRooms: 10,
      occupancyRate: 83.3,
      adr: 260,
      revpar: 216.7
    },
    {
      date: '2024-01-11',
      totalRooms: 12,
      occupiedRooms: 7,
      occupancyRate: 58.3,
      adr: 215,
      revpar: 125.4
    },
    {
      date: '2024-01-10',
      totalRooms: 12,
      occupiedRooms: 8,
      occupancyRate: 66.7,
      adr: 230,
      revpar: 153.3
    }
  ]
}