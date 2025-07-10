'use client'

import { useState, useEffect } from 'react'
import { initSocket, getSocket, disconnectSocket } from '@/lib/socket'

export default function TestSocket() {
  const [status, setStatus] = useState('Not connected')
  const [messages, setMessages] = useState<string[]>([])
  const [testMessage, setTestMessage] = useState('')

  const socket = getSocket()

  useEffect(() => {
    if (!socket) {
      const newSocket = initSocket({ name: 'Test User', email: 'test@example.com' })
      newSocket.connect()
    }

    if (socket) {
      socket.on('connect', () => {
        setStatus('Connected')
        setMessages(prev => [...prev, 'Connected to socket server'])
      })

      socket.on('disconnect', () => {
        setStatus('Disconnected')
        setMessages(prev => [...prev, 'Disconnected from socket server'])
      })

      socket.on('connect_error', (error) => {
        setStatus('Connection error')
        setMessages(prev => [...prev, `Connection error: ${error.message}`])
      })

      socket.on('chat-session-created', (session) => {
        setMessages(prev => [...prev, `Chat session created: ${session.id}`])
      })

      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, `New message: ${message.content}`])
      })
    }

    return () => {
      if (socket) {
        socket.off('connect')
        socket.off('disconnect')
        socket.off('connect_error')
        socket.off('chat-session-created')
        socket.off('new-message')
      }
    }
  }, [socket])

  const sendTestMessage = () => {
    if (socket && testMessage.trim()) {
      socket.emit('join-customer-chat', {
        customerId: 'test@example.com',
        customerName: 'Test User'
      })
      setMessages(prev => [...prev, `Sending test message: ${testMessage}`])
      setTestMessage('')
    }
  }

  const disconnect = () => {
    disconnectSocket()
    setStatus('Disconnected')
    setMessages(prev => [...prev, 'Manually disconnected'])
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Socket.IO Test Page</h1>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Status: <span className="font-semibold">{status}</span></p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-2 mb-4">
          <button
            onClick={sendTestMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send Test Message
          </button>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Disconnect
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto">
          <h3 className="font-semibold mb-2">Messages:</h3>
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            <div className="space-y-1">
              {messages.map((msg, index) => (
                <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 