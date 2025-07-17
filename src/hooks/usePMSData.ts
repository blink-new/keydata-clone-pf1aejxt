import { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { PMSData, PMSConnection } from '../types/pms'
import { pmsApiService } from '../services/pmsApiService'
import { sampleConnections, samplePMSData } from '../data/sampleData'

export function usePMSData() {
  const [data, setData] = useState<PMSData | null>(null)
  const [connections, setConnections] = useState<PMSConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const fetchConnections = async () => {
    try {
      const user = await blink.auth.me()
      if (!user) {
        setConnections([])
        return
      }

      // Try to fetch from localStorage first (for demo purposes)
      const storedConnections = localStorage.getItem(`pms_connections_${user.id}`)
      if (storedConnections) {
        setConnections(JSON.parse(storedConnections))
      } else {
        // Use sample data as fallback
        setConnections(sampleConnections)
      }
    } catch (err) {
      console.error('Failed to fetch PMS connections:', err)
      setError('Failed to load PMS connections')
      // Fallback to sample data
      setConnections(sampleConnections)
    }
  }

  const fetchPMSData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const user = await blink.auth.me()
      if (!user) {
        setData(null)
        return
      }

      // Check if we have any connected PMS systems
      const connectedSystems = connections.filter(conn => conn.status === 'connected')
      
      if (connectedSystems.length === 0) {
        // Use sample data when no real connections
        setData(samplePMSData)
        setLastSync(new Date().toISOString())
      } else {
        // Try to fetch real data from connected systems
        const allData: PMSData = {
          reservations: [],
          guests: [],
          rooms: [],
          revenue: [],
          occupancy: []
        }

        for (const connection of connectedSystems) {
          try {
            const connectionData = await pmsApiService.syncData(connection)
            allData.reservations.push(...connectionData.reservations)
            allData.guests.push(...connectionData.guests)
            allData.rooms.push(...connectionData.rooms)
            allData.revenue.push(...connectionData.revenue)
            allData.occupancy.push(...connectionData.occupancy)
          } catch (syncError) {
            console.warn(`Failed to sync data from ${connection.name}:`, syncError)
            // Continue with other connections
          }
        }

        setData(allData)
        setLastSync(new Date().toISOString())
      }
    } catch (err) {
      console.error('Failed to fetch PMS data:', err)
      setError('Failed to load PMS data')
      // Fallback to sample data
      setData(samplePMSData)
    } finally {
      setLoading(false)
    }
  }, [connections])

  const syncWithPMS = async (connectionId: string) => {
    try {
      setLoading(true)
      setError(null)

      const connection = connections.find(conn => conn.id === connectionId)
      if (!connection) {
        throw new Error('Connection not found')
      }

      // Update connection status to syncing
      const updatedConnections = connections.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'syncing' as const }
          : conn
      )
      setConnections(updatedConnections)

      // Test connection first
      const isConnected = await pmsApiService.testConnection(connection)
      
      if (!isConnected) {
        throw new Error('Connection test failed')
      }

      // Sync data
      await pmsApiService.syncData(connection)

      // Update connection status to connected
      const finalConnections = connections.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'connected' as const, lastSync: new Date().toISOString() }
          : conn
      )
      setConnections(finalConnections)

      // Store updated connections
      const user = await blink.auth.me()
      if (user) {
        localStorage.setItem(`pms_connections_${user.id}`, JSON.stringify(finalConnections))
      }

      // Refresh data
      await fetchPMSData()
    } catch (err) {
      console.error('Sync failed:', err)
      setError(`Failed to sync with PMS: ${err.message}`)
      
      // Update connection status to error
      const updatedConnections = connections.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'error' as const, lastSync: new Date().toISOString() }
          : conn
      )
      setConnections(updatedConnections)

      // Store updated connections
      const user = await blink.auth.me()
      if (user) {
        localStorage.setItem(`pms_connections_${user.id}`, JSON.stringify(updatedConnections))
      }
    } finally {
      setLoading(false)
    }
  }

  const addConnection = async (connection: Omit<PMSConnection, 'id' | 'lastSync'>) => {
    try {
      const user = await blink.auth.me()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const newConnection = {
        ...connection,
        id: `conn_${Date.now()}`,
        lastSync: new Date().toISOString()
      }
      
      const updatedConnections = [...connections, newConnection]
      setConnections(updatedConnections)

      // Store in localStorage
      localStorage.setItem(`pms_connections_${user.id}`, JSON.stringify(updatedConnections))

      return newConnection
    } catch (err) {
      console.error('Failed to add connection:', err)
      throw new Error('Failed to add PMS connection')
    }
  }

  const removeConnection = async (connectionId: string) => {
    try {
      const user = await blink.auth.me()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const updatedConnections = connections.filter(conn => conn.id !== connectionId)
      setConnections(updatedConnections)

      // Store in localStorage
      localStorage.setItem(`pms_connections_${user.id}`, JSON.stringify(updatedConnections))
    } catch (err) {
      console.error('Failed to remove connection:', err)
      throw new Error('Failed to remove PMS connection')
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  useEffect(() => {
    if (connections.length >= 0) {
      fetchPMSData()
    }
  }, [connections, fetchPMSData])

  return {
    data,
    connections,
    loading,
    error,
    lastSync,
    syncWithPMS,
    addConnection,
    removeConnection,
    refreshData: fetchPMSData
  }
}