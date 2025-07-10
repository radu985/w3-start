import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initSocket = (userData?: { name?: string; email?: string; role?: string }) => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    console.log('Initializing socket connection to:', socketUrl)
    
    socket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    })

    socket.on('connect', () => {
      console.log('Connected to socket server with ID:', socket?.id)
      // Do NOT emit join-chat here. Let components handle their own join events.
    })

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server. Reason:', reason)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      console.error('Error details:', {
        message: error.message,
        ...(error.hasOwnProperty('description') && { description: (error as any).description }),
        ...(error.hasOwnProperty('context') && { context: (error as any).context })
      })
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket')
    socket.disconnect()
    socket = null
  }
} 