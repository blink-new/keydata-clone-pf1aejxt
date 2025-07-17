import { blink } from '../blink/client'
import { PMSConnection, PMSData, Reservation, Guest, Room, RevenueData, OccupancyData } from '../types/pms'

export class PMSApiService {
  private static instance: PMSApiService
  
  static getInstance(): PMSApiService {
    if (!PMSApiService.instance) {
      PMSApiService.instance = new PMSApiService()
    }
    return PMSApiService.instance
  }

  async testConnection(connection: PMSConnection): Promise<boolean> {
    try {
      const response = await blink.data.fetch({
        url: `${connection.apiEndpoint}/health`,
        method: 'GET',
        headers: this.getAuthHeaders(connection),
        timeout: 10000
      })
      
      return response.status >= 200 && response.status < 300
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }

  async syncData(connection: PMSConnection): Promise<PMSData> {
    try {
      const [reservations, guests, rooms, revenue, occupancy] = await Promise.all([
        this.fetchReservations(connection),
        this.fetchGuests(connection),
        this.fetchRooms(connection),
        this.fetchRevenue(connection),
        this.fetchOccupancy(connection)
      ])

      const pmsData: PMSData = {
        reservations,
        guests,
        rooms,
        revenue,
        occupancy
      }

      // Store synced data in database
      await this.storeSyncedData(connection.id, pmsData)
      
      return pmsData
    } catch (error) {
      console.error('Data sync failed:', error)
      throw new Error(`Failed to sync data from ${connection.name}: ${error.message}`)
    }
  }

  private async fetchReservations(connection: PMSConnection): Promise<Reservation[]> {
    const endpoint = this.getEndpointForPMSType(connection.type, 'reservations')
    const response = await blink.data.fetch({
      url: `${connection.apiEndpoint}${endpoint}`,
      method: 'GET',
      headers: this.getAuthHeaders(connection),
      query: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Next 30 days
      }
    })

    if (response.status !== 200) {
      throw new Error(`Failed to fetch reservations: ${response.status}`)
    }

    return this.transformReservations(response.body, connection.type)
  }

  private async fetchGuests(connection: PMSConnection): Promise<Guest[]> {
    const endpoint = this.getEndpointForPMSType(connection.type, 'guests')
    const response = await blink.data.fetch({
      url: `${connection.apiEndpoint}${endpoint}`,
      method: 'GET',
      headers: this.getAuthHeaders(connection),
      query: {
        limit: 1000,
        active: true
      }
    })

    if (response.status !== 200) {
      throw new Error(`Failed to fetch guests: ${response.status}`)
    }

    return this.transformGuests(response.body, connection.type)
  }

  private async fetchRooms(connection: PMSConnection): Promise<Room[]> {
    const endpoint = this.getEndpointForPMSType(connection.type, 'rooms')
    const response = await blink.data.fetch({
      url: `${connection.apiEndpoint}${endpoint}`,
      method: 'GET',
      headers: this.getAuthHeaders(connection)
    })

    if (response.status !== 200) {
      throw new Error(`Failed to fetch rooms: ${response.status}`)
    }

    return this.transformRooms(response.body, connection.type)
  }

  private async fetchRevenue(connection: PMSConnection): Promise<RevenueData[]> {
    const endpoint = this.getEndpointForPMSType(connection.type, 'revenue')
    const response = await blink.data.fetch({
      url: `${connection.apiEndpoint}${endpoint}`,
      method: 'GET',
      headers: this.getAuthHeaders(connection),
      query: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString(),
        groupBy: 'day'
      }
    })

    if (response.status !== 200) {
      throw new Error(`Failed to fetch revenue: ${response.status}`)
    }

    return this.transformRevenue(response.body, connection.type)
  }

  private async fetchOccupancy(connection: PMSConnection): Promise<OccupancyData[]> {
    const endpoint = this.getEndpointForPMSType(connection.type, 'occupancy')
    const response = await blink.data.fetch({
      url: `${connection.apiEndpoint}${endpoint}`,
      method: 'GET',
      headers: this.getAuthHeaders(connection),
      query: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString()
      }
    })

    if (response.status !== 200) {
      throw new Error(`Failed to fetch occupancy: ${response.status}`)
    }

    return this.transformOccupancy(response.body, connection.type)
  }

  private getAuthHeaders(connection: PMSConnection): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    switch (connection.authType) {
      case 'api_key':
        // Use secret substitution for API keys
        headers['Authorization'] = `Bearer {{${connection.id}_api_key}}`
        break
      case 'basic_auth':
        headers['Authorization'] = `Basic {{${connection.id}_basic_auth}}`
        break
      case 'oauth':
        headers['Authorization'] = `Bearer {{${connection.id}_oauth_token}}`
        break
    }

    return headers
  }

  private getEndpointForPMSType(pmsType: PMSConnection['type'], dataType: string): string {
    const endpoints = {
      opera: {
        reservations: '/reservations',
        guests: '/profiles',
        rooms: '/rooms',
        revenue: '/revenue',
        occupancy: '/occupancy'
      },
      mews: {
        reservations: '/api/connector/v1/reservations/getAll',
        guests: '/api/connector/v1/customers/getAll',
        rooms: '/api/connector/v1/spaces/getAll',
        revenue: '/api/connector/v1/accountingItems/getAll',
        occupancy: '/api/connector/v1/reports/getOccupancy'
      },
      fidelio: {
        reservations: '/fidelio/v1/reservations',
        guests: '/fidelio/v1/guests',
        rooms: '/fidelio/v1/rooms',
        revenue: '/fidelio/v1/revenue',
        occupancy: '/fidelio/v1/occupancy'
      },
      protel: {
        reservations: '/pms/v1/reservations',
        guests: '/pms/v1/guests',
        rooms: '/pms/v1/rooms',
        revenue: '/pms/v1/revenue',
        occupancy: '/pms/v1/occupancy'
      },
      cloudbeds: {
        reservations: '/api/v1.1/getReservations',
        guests: '/api/v1.1/getGuests',
        rooms: '/api/v1.1/getRooms',
        revenue: '/api/v1.1/getRevenue',
        occupancy: '/api/v1.1/getOccupancy'
      },
      rms: {
        reservations: '/api/reservations',
        guests: '/api/guests',
        rooms: '/api/rooms',
        revenue: '/api/revenue',
        occupancy: '/api/occupancy'
      },
      custom: {
        reservations: '/reservations',
        guests: '/guests',
        rooms: '/rooms',
        revenue: '/revenue',
        occupancy: '/occupancy'
      }
    }

    return endpoints[pmsType]?.[dataType] || `/${dataType}`
  }

  private transformReservations(data: any, pmsType: PMSConnection['type']): Reservation[] {
    if (!data || !Array.isArray(data)) return []

    return data.map(item => {
      switch (pmsType) {
        case 'mews':
          return {
            id: item.Id || item.id,
            guestId: item.CustomerId || item.customer_id,
            roomNumber: item.AssignedSpaceNumber || item.room_number,
            checkIn: item.StartUtc || item.check_in,
            checkOut: item.EndUtc || item.check_out,
            status: this.mapReservationStatus(item.State || item.status, pmsType),
            totalAmount: item.TotalAmount?.Value || item.total_amount || 0,
            currency: item.TotalAmount?.Currency || item.currency || 'USD',
            source: item.Origin || item.source || 'Direct',
            createdAt: item.CreatedUtc || item.created_at || new Date().toISOString(),
            updatedAt: item.UpdatedUtc || item.updated_at || new Date().toISOString()
          }
        case 'opera':
          return {
            id: item.ReservationId || item.id,
            guestId: item.ProfileId || item.guest_id,
            roomNumber: item.RoomNumber || item.room_number,
            checkIn: item.ArrivalDate || item.check_in,
            checkOut: item.DepartureDate || item.check_out,
            status: this.mapReservationStatus(item.ReservationStatus || item.status, pmsType),
            totalAmount: item.TotalAmount || item.total_amount || 0,
            currency: item.Currency || item.currency || 'USD',
            source: item.Source || item.source || 'Direct',
            createdAt: item.CreatedDate || item.created_at || new Date().toISOString(),
            updatedAt: item.ModifiedDate || item.updated_at || new Date().toISOString()
          }
        default:
          return {
            id: item.id || item.reservation_id,
            guestId: item.guest_id || item.guestId,
            roomNumber: item.room_number || item.roomNumber,
            checkIn: item.check_in || item.checkIn,
            checkOut: item.check_out || item.checkOut,
            status: this.mapReservationStatus(item.status, pmsType),
            totalAmount: item.total_amount || item.totalAmount || 0,
            currency: item.currency || 'USD',
            source: item.source || 'Direct',
            createdAt: item.created_at || item.createdAt || new Date().toISOString(),
            updatedAt: item.updated_at || item.updatedAt || new Date().toISOString()
          }
      }
    })
  }

  private transformGuests(data: any, pmsType: PMSConnection['type']): Guest[] {
    if (!data || !Array.isArray(data)) return []

    return data.map(item => {
      switch (pmsType) {
        case 'mews':
          return {
            id: item.Id || item.id,
            firstName: item.FirstName || item.first_name,
            lastName: item.LastName || item.last_name,
            email: item.Email || item.email,
            phone: item.Phone || item.phone,
            nationality: item.NationalityCode || item.nationality || 'Unknown',
            vipStatus: item.Classifications?.includes('Vip') || false,
            totalStays: item.TotalStays || 0,
            totalSpent: item.TotalSpent || 0,
            lastStay: item.LastStay || new Date().toISOString()
          }
        case 'opera':
          return {
            id: item.ProfileId || item.id,
            firstName: item.FirstName || item.first_name,
            lastName: item.LastName || item.last_name,
            email: item.EmailAddress || item.email,
            phone: item.PhoneNumber || item.phone,
            nationality: item.Nationality || item.nationality || 'Unknown',
            vipStatus: item.VipStatus || false,
            totalStays: item.TotalStays || 0,
            totalSpent: item.TotalRevenue || 0,
            lastStay: item.LastStayDate || new Date().toISOString()
          }
        default:
          return {
            id: item.id || item.guest_id,
            firstName: item.first_name || item.firstName,
            lastName: item.last_name || item.lastName,
            email: item.email,
            phone: item.phone,
            nationality: item.nationality || 'Unknown',
            vipStatus: item.vip_status || item.vipStatus || false,
            totalStays: item.total_stays || item.totalStays || 0,
            totalSpent: item.total_spent || item.totalSpent || 0,
            lastStay: item.last_stay || item.lastStay || new Date().toISOString()
          }
      }
    })
  }

  private transformRooms(data: any, pmsType: PMSConnection['type']): Room[] {
    if (!data || !Array.isArray(data)) return []

    return data.map(item => ({
      id: item.id || item.room_id || item.Id,
      number: item.number || item.room_number || item.Number,
      type: item.type || item.room_type || item.Type,
      status: this.mapRoomStatus(item.status || item.Status, pmsType),
      floor: item.floor || item.Floor || 1,
      capacity: item.capacity || item.Capacity || 2,
      rate: item.rate || item.Rate || 0
    }))
  }

  private transformRevenue(data: any, pmsType: PMSConnection['type']): RevenueData[] {
    if (!data || !Array.isArray(data)) return []

    return data.map(item => ({
      date: item.date || item.Date,
      roomRevenue: item.room_revenue || item.roomRevenue || item.RoomRevenue || 0,
      fbRevenue: item.fb_revenue || item.fbRevenue || item.FBRevenue || 0,
      otherRevenue: item.other_revenue || item.otherRevenue || item.OtherRevenue || 0,
      totalRevenue: item.total_revenue || item.totalRevenue || item.TotalRevenue || 0,
      currency: item.currency || item.Currency || 'USD'
    }))
  }

  private transformOccupancy(data: any, pmsType: PMSConnection['type']): OccupancyData[] {
    if (!data || !Array.isArray(data)) return []

    return data.map(item => ({
      date: item.date || item.Date,
      totalRooms: item.total_rooms || item.totalRooms || item.TotalRooms || 0,
      occupiedRooms: item.occupied_rooms || item.occupiedRooms || item.OccupiedRooms || 0,
      occupancyRate: item.occupancy_rate || item.occupancyRate || item.OccupancyRate || 0,
      adr: item.adr || item.ADR || 0,
      revpar: item.revpar || item.RevPAR || 0
    }))
  }

  private mapReservationStatus(status: string, pmsType: PMSConnection['type']): Reservation['status'] {
    if (!status) return 'confirmed'
    
    const statusLower = status.toLowerCase()
    
    if (statusLower.includes('confirm') || statusLower.includes('booked')) return 'confirmed'
    if (statusLower.includes('check') && statusLower.includes('in')) return 'checked_in'
    if (statusLower.includes('check') && statusLower.includes('out')) return 'checked_out'
    if (statusLower.includes('cancel')) return 'cancelled'
    if (statusLower.includes('no') && statusLower.includes('show')) return 'no_show'
    
    return 'confirmed'
  }

  private mapRoomStatus(status: string, pmsType: PMSConnection['type']): Room['status'] {
    if (!status) return 'available'
    
    const statusLower = status.toLowerCase()
    
    if (statusLower.includes('available') || statusLower.includes('clean')) return 'available'
    if (statusLower.includes('occupied') || statusLower.includes('dirty')) return 'occupied'
    if (statusLower.includes('maintenance') || statusLower.includes('repair')) return 'maintenance'
    if (statusLower.includes('out') || statusLower.includes('order')) return 'out_of_order'
    
    return 'available'
  }

  private async storeSyncedData(connectionId: string, data: PMSData): Promise<void> {
    try {
      // Store in database with user_id for proper isolation
      const user = await blink.auth.me()
      
      // Store reservations
      for (const reservation of data.reservations) {
        await blink.db.reservations.create({
          id: `${connectionId}_${reservation.id}`,
          connectionId,
          userId: user.id,
          ...reservation,
          syncedAt: new Date().toISOString()
        })
      }

      // Store guests
      for (const guest of data.guests) {
        await blink.db.guests.create({
          id: `${connectionId}_${guest.id}`,
          connectionId,
          userId: user.id,
          ...guest,
          syncedAt: new Date().toISOString()
        })
      }

      // Store rooms
      for (const room of data.rooms) {
        await blink.db.rooms.create({
          id: `${connectionId}_${room.id}`,
          connectionId,
          userId: user.id,
          ...room,
          syncedAt: new Date().toISOString()
        })
      }

      // Store revenue data
      for (const revenue of data.revenue) {
        await blink.db.revenue.create({
          id: `${connectionId}_${revenue.date}`,
          connectionId,
          userId: user.id,
          ...revenue,
          syncedAt: new Date().toISOString()
        })
      }

      // Store occupancy data
      for (const occupancy of data.occupancy) {
        await blink.db.occupancy.create({
          id: `${connectionId}_${occupancy.date}`,
          connectionId,
          userId: user.id,
          ...occupancy,
          syncedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Failed to store synced data:', error)
      throw error
    }
  }
}

export const pmsApiService = PMSApiService.getInstance()