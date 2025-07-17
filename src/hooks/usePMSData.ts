import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { PMSData, PMSConnection } from '../types/pms'
import { sampleConnections, samplePMSData } from '../data/sampleData'

export function usePMSData() {
  const [data, setData] = useState<PMSData | null>(null)
  const [connections, setConnections] = useState<PMSConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const fetchConnections = async () => {
    try {
      // For demo purposes, use sample data
      // In production, this would fetch from the database
      setConnections(sampleConnections)
    } catch (err) {
      console.error('Failed to fetch PMS connections:', err)
      setError('Failed to load PMS connections')
    }
  }

  const fetchPMSData = async () => {
    try {
      setLoading(true)
      setError(null)

      // For demo purposes, use sample data
      // In production, this would fetch from the database
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      setData(samplePMSData)
      setLastSync(new Date().toISOString())
    } catch (err) {
      console.error('Failed to fetch PMS data:', err)
      setError('Failed to load PMS data')
    } finally {
      setLoading(false)
    }
  }

  const syncWithPMS = async (connectionId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update connection status in sample data
      const updatedConnections = connections.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'connected' as const, lastSync: new Date().toISOString() }
          : conn
      )
      setConnections(updatedConnections)

      // Refresh data
      await fetchPMSData()
    } catch (err) {
      console.error('Sync failed:', err)
      setError('Failed to sync with PMS')
      
      // Update connection status to error
      const updatedConnections = connections.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'error' as const, lastSync: new Date().toISOString() }
          : conn
      )
      setConnections(updatedConnections)
    } finally {
      setLoading(false)
    }
  }

  const addConnection = async (connection: Omit<PMSConnection, 'id' | 'lastSync'>) => {
    try {
      const newConnection = {
        ...connection,
        id: `conn_${Date.now()}`,
        lastSync: new Date().toISOString()
      }
      
      setConnections(prev => [...prev, newConnection])
      return newConnection
    } catch (err) {
      console.error('Failed to add connection:', err)
      throw new Error('Failed to add PMS connection')
    }
  }

  const removeConnection = async (connectionId: string) => {
    try {
      setConnections(prev => prev.filter(conn => conn.id !== connectionId))
    } catch (err) {
      console.error('Failed to remove connection:', err)
      throw new Error('Failed to remove PMS connection')
    }
  }

  useEffect(() => {
    fetchConnections()
    fetchPMSData()
  }, [])

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