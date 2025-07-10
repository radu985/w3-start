const { Server } = require('socket.io')
const { createServer } = require('http')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://yourdomain.com"],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
})

// Store connected users and chat sessions
const connectedUsers = new Map()
const chatSessions = new Map()
const adminSockets = new Set()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id, 'from:', socket.handshake.address)

  // Handle customer joining chat
  socket.on('join-customer-chat', async (userData) => {
    console.log('Customer joining chat:', userData)
    const customerId = userData.customerId
    const customerName = userData.customerName
    
    connectedUsers.set(socket.id, {
      id: socket.id,
      name: customerName,
      role: 'customer',
      customerId: customerId
    })

    // Check if customer already has an active session
    let session = Array.from(chatSessions.values()).find(s => 
      s.customerId === customerId && s.status !== 'closed'
    )

    if (!session) {
      // Create new session
      session = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customerId: customerId,
        customerName: customerName,
        status: 'waiting',
        lastMessage: null,
        unreadCount: 0,
        messages: []
      }
      chatSessions.set(session.id, session)
      console.log('Created new session:', session.id, 'for customer:', customerName)
    } else {
      // Load existing messages from database
      try {
        const apiUrl = process.env.NEXT_APP_URL || 'http://localhost:3000'
        const response = await fetch(`${apiUrl}/api/chat/messages?sessionId=${session.id}`)
        
        if (response.ok) {
          const dbMessages = await response.json()
          session.messages = dbMessages
        }
      } catch (error) {
        console.error('Error loading messages from database:', error)
      }
    }

    socket.sessionId = session.id
    socket.join(session.id)
    
    // Notify customer about session
    socket.emit('chat-session-created', {
      id: session.id,
      customerId: session.customerId,
      customerName: session.customerName,
      status: session.status
    })

    // Send chat history if exists
    if (session.messages.length > 0) {
      socket.emit('chat-history', session.messages)
    }

    // Notify admins about new/updated session
    notifyAdminsOfSessions()
  })

  // Handle admin joining chat
  socket.on('join-admin-chat', async (userData) => {
    console.log('Admin joining chat:', userData)
    const adminId = userData.adminId
    const adminName = userData.adminName
    
    connectedUsers.set(socket.id, {
      id: socket.id,
      name: adminName,
      role: 'admin',
      adminId: adminId
    })

    adminSockets.add(socket.id)
    socket.join('admin-room')
    
    console.log('Admin joined admin-room. Total admins:', adminSockets.size)
    console.log('Current connected users:', Array.from(connectedUsers.values()).map(u => ({ id: u.id, name: u.name, role: u.role })))
    
    try {
      // Load active sessions from database
      const apiUrl = process.env.NEXT_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/chat/sessions`)
      
      if (response.ok) {
        const dbSessions = await response.json()
        
        // Update in-memory sessions with database data
        dbSessions.forEach(dbSession => {
          chatSessions.set(dbSession.id, {
            ...dbSession,
            messages: dbSession.messages || [],
            unreadCount: dbSession.unreadCount || 0
          })
        })
      }
    } catch (error) {
      console.error('Error loading sessions from database:', error)
    }
    
    // Send all active sessions to admin
    const activeSessions = Array.from(chatSessions.values())
      .filter(s => s.status !== 'closed')
      .map(s => ({
        id: s.id,
        customerId: s.customerId,
        customerName: s.customerName,
        status: s.status,
        lastMessage: s.lastMessage,
        unreadCount: s.unreadCount
      }))
    
    console.log('Sending active sessions to admin:', activeSessions.length, 'sessions:', activeSessions)
    socket.emit('chat-sessions-updated', activeSessions)
  })

  // Handle customer sending message
  socket.on('send-customer-message', async (messageData) => {
    console.log('Customer sending message:', messageData)
    const user = connectedUsers.get(socket.id)
    const session = chatSessions.get(messageData.sessionId)
    
    if (!user || !session || user.role !== 'customer') {
      console.log('Invalid customer message - user:', !!user, 'session:', !!session, 'role:', user?.role)
      return
    }

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: messageData.content,
      senderId: socket.id,
      senderName: user.name,
      senderRole: 'customer',
      timestamp: new Date()
    }

    // Save to database
    try {
      const apiUrl = process.env.NEXT_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageData.content,
          senderId: socket.id,
          sessionId: session.id,
          senderName: user.name,
          senderRole: 'customer'
        })
      })

      if (response.ok) {
        const savedMessage = await response.json()
        message.id = savedMessage.id
        message.timestamp = new Date(savedMessage.timestamp)
      }
    } catch (error) {
      console.error('Error saving message to database:', error)
    }

    // Add message to session
    session.messages.push(message)
    session.lastMessage = message.timestamp
    session.unreadCount += 1

    console.log('Broadcasting customer message to session:', session.id)
    // Send to customer
    io.to(session.id).emit('new-message', message)
    
    // Notify admins
    io.to('admin-room').emit('new-message', { ...message, sessionId: session.id })
    notifyAdminsOfSessions()
  })

  // Handle admin sending message
  socket.on('send-admin-message', async (messageData) => {
    console.log('Admin sending message:', messageData)
    const user = connectedUsers.get(socket.id)
    const session = chatSessions.get(messageData.sessionId)
    
    if (!user || !session || user.role !== 'admin') {
      console.log('Invalid admin message - user:', !!user, 'session:', !!session, 'role:', user?.role)
      return
    }

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: messageData.content,
      senderId: socket.id,
      senderName: user.name,
      senderRole: 'admin',
      timestamp: new Date()
    }

    // Save to database
    try {
      const apiUrl = process.env.NEXT_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageData.content,
          senderId: socket.id,
          sessionId: session.id,
          senderName: user.name,
          senderRole: 'admin'
        })
      })

      if (response.ok) {
        const savedMessage = await response.json()
        message.id = savedMessage.id
        message.timestamp = new Date(savedMessage.timestamp)
      }
    } catch (error) {
      console.error('Error saving message to database:', error)
    }

    // Add message to session
    session.messages.push(message)
    session.lastMessage = message.timestamp
    session.status = 'active'

    console.log('Broadcasting admin message to session:', session.id)
    // Send to customer
    io.to(session.id).emit('new-message', message)
    
    // Notify admins
    io.to('admin-room').emit('new-message', { ...message, sessionId: session.id })
    notifyAdminsOfSessions()
  })

  // Handle customer typing
  socket.on('customer-typing', (data) => {
    const user = connectedUsers.get(socket.id)
    if (!user || user.role !== 'customer') return

    io.to('admin-room').emit('customer-typing', {
      sessionId: data.sessionId,
      isTyping: data.isTyping
    })
  })

  // Handle admin typing
  socket.on('admin-typing', (data) => {
    const user = connectedUsers.get(socket.id)
    if (!user || user.role !== 'admin') return

    io.to(data.sessionId).emit('admin-typing', data.isTyping)
  })

  // Handle admin joining specific session
  socket.on('join-session', async (sessionId) => {
    const user = connectedUsers.get(socket.id)
    const session = chatSessions.get(sessionId)
    
    if (!user || user.role !== 'admin' || !session) return

    session.status = 'active'
    socket.join(sessionId)
    
    // Notify customer that admin joined
    io.to(sessionId).emit('admin-joined')
    
    try {
      // Load messages from database
      const apiUrl = process.env.NEXT_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/chat/messages?sessionId=${sessionId}`)
      
      if (response.ok) {
        const dbMessages = await response.json()
        session.messages = dbMessages
      }
    } catch (error) {
      console.error('Error loading messages from database:', error)
    }
    
    // Send session messages to admin
    socket.emit('chat-messages', {
      sessionId: sessionId,
      messages: session.messages
    })

    notifyAdminsOfSessions()
  })

  // Handle admin leaving session
  socket.on('leave-session', (sessionId) => {
    const user = connectedUsers.get(socket.id)
    const session = chatSessions.get(sessionId)
    
    if (!user || user.role !== 'admin' || !session) return

    session.status = 'waiting'
    socket.leave(sessionId)
    
    // Notify customer that admin left
    io.to(sessionId).emit('admin-left')
    
    notifyAdminsOfSessions()
  })

  // Handle closing chat session
  socket.on('close-chat-session', (sessionId) => {
    const user = connectedUsers.get(socket.id)
    const session = chatSessions.get(sessionId)
    
    if (!user || user.role !== 'admin' || !session) return

    session.status = 'closed'
    
    // Notify customer that session is closed
    io.to(sessionId).emit('chat-session-updated', {
      id: session.id,
      customerId: session.customerId,
      customerName: session.customerName,
      status: session.status
    })
    
    notifyAdminsOfSessions()
  })

  // Handle requesting chat history
  socket.on('request-chat-history', (data) => {
    const user = connectedUsers.get(socket.id)
    const session = chatSessions.get(data.sessionId)
    
    if (!user || !session) return

    socket.emit('chat-messages', {
      sessionId: data.sessionId,
      messages: session.messages
    })
  })

  // Handle admin deleting session history
  socket.on('delete-session-history', async (data) => {
    const user = connectedUsers.get(socket.id)
    const session = chatSessions.get(data.sessionId)
    if (!user || user.role !== 'admin' || !session) return

    try {
      // Delete from database
      const apiUrl = process.env.NEXT_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/chat/delete-history`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: data.sessionId })
      })

      if (!response.ok) {
        console.error('Failed to delete chat history from database')
        return
      }

      // Remove from memory
      chatSessions.delete(data.sessionId)

      // Notify all admins to remove the session
      io.to('admin-room').emit('session-removed', { sessionId: data.sessionId })
      // Notify customer (if connected) that their session was deleted
      io.to(data.sessionId).emit('session-deleted')
      // Update session info for admins
      notifyAdminsOfSessions()
    } catch (error) {
      console.error('Error deleting chat history:', error)
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id)
    if (user) {
      if (user.role === 'admin') {
        adminSockets.delete(socket.id)
      } else if (user.role === 'customer' && socket.sessionId) {
        const session = chatSessions.get(socket.sessionId)
        if (session && session.status === 'active') {
          session.status = 'waiting'
          notifyAdminsOfSessions()
        }
      }
      
      connectedUsers.delete(socket.id)
    }
    
    console.log('User disconnected:', socket.id)
  })

  // Helper function to notify admins of session updates
  function notifyAdminsOfSessions() {
    const activeSessions = Array.from(chatSessions.values())
      .filter(s => s.status !== 'closed')
      .map(s => ({
        id: s.id,
        customerId: s.customerId,
        customerName: s.customerName,
        status: s.status,
        lastMessage: s.lastMessage,
        unreadCount: s.unreadCount
      }))
    
    console.log('Notifying admins of sessions. Total admins:', adminSockets.size, 'Active sessions:', activeSessions.length)
    console.log('Active sessions:', activeSessions)
    io.to('admin-room').emit('chat-sessions-updated', activeSessions)
  }
})

const PORT = process.env.SOCKET_PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

module.exports = { io, httpServer } 