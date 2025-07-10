'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Users, Clock, CheckCircle, AlertCircle, X, Minimize2, Maximize2, Trash2 } from 'lucide-react'
import { initSocket, getSocket, disconnectSocket } from '@/lib/socket'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderRole: 'admin' | 'customer'
  timestamp: Date
}

interface ChatSession {
  id: string
  customerId: string
  customerName: string
  status: 'active' | 'waiting' | 'closed'
  lastMessage?: Date
  unreadCount: number
}

interface AdminChatManagerProps {
  userData?: {
    name?: string
    email?: string
    role?: string
  }
}

export default function AdminChatManager({ userData }: AdminChatManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [customerTyping, setCustomerTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const [textareaRows, setTextareaRows] = useState(1)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ show: boolean, sessionId: string | null }>({ show: false, sessionId: null });

  const socket = getSocket()

  // Debug logging
  useEffect(() => {
    console.log('AdminChatManager - userData:', userData)
    console.log('AdminChatManager - socket:', socket)
    console.log('AdminChatManager - isOpen:', isOpen)
  }, [userData, socket, isOpen])

  useEffect(() => {
    if (!socket) {
      const newSocket = initSocket(userData)
      newSocket.connect()
    }
    if (socket) {
      // Only emit events when socket is connected
      if (socket.connected) {
        console.log('Socket connected, joining admin chat')
        socket.emit('join-admin-chat', {
          adminId: userData?.email || 'admin',
          adminName: userData?.name || 'Admin'
        })
      } else {
        // Wait for connection before emitting
        socket.on('connect', () => {
          console.log('Socket connected, joining admin chat')
          socket.emit('join-admin-chat', {
            adminId: userData?.email || 'admin',
            adminName: userData?.name || 'Admin'
          })
        })
      }

      socket.on('chat-sessions-updated', (updatedSessions: ChatSession[]) => {
        console.log('Chat sessions updated:', updatedSessions.length, 'sessions')
        setSessions(updatedSessions)
      })

      socket.on('new-customer-session', (session: ChatSession) => {
        console.log('New customer session:', session)
        setSessions(prev => [session, ...prev])
      })

      socket.on('chat-messages', (sessionMessages: { sessionId: string; messages: Message[] }) => {
        console.log('Chat messages received for session:', sessionMessages.sessionId, sessionMessages.messages.length, 'messages')
        if (selectedSession && sessionMessages.sessionId === selectedSession.id) {
          setMessages(sessionMessages.messages)
        }
      })

      socket.on('new-message', (message: Message & { sessionId: string }) => {
        console.log('New message received:', message)
        if (selectedSession && message.sessionId === selectedSession.id) {
          setMessages(prev => [...prev, message])
        }
        // Update unread count for other sessions
        setSessions(prev => prev.map(session => 
          session.id === message.sessionId && session.id !== selectedSession?.id
            ? { ...session, unreadCount: session.unreadCount + 1 }
            : session
        ))
      })

      socket.on('customer-typing', ({ sessionId, isTyping }) => {
        console.log('Customer typing:', sessionId, isTyping)
        if (selectedSession && sessionId === selectedSession.id) {
          setCustomerTyping(isTyping)
        }
      })

      socket.on('session-status-updated', (session: ChatSession) => {
        console.log('Session status updated:', session)
        setSessions(prev => prev.map(s => 
          s.id === session.id ? session : s
        ))
        if (selectedSession && selectedSession.id === session.id) {
          setSelectedSession(session)
        }
      })

      socket.on('connect', () => {
        console.log('Socket connected')
        setIsConnected(true)
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
        setIsConnected(false)
      })

      socket.on('session-removed', ({ sessionId }) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId))
        if (selectedSession && selectedSession.id === sessionId) {
          setSelectedSession(null)
          setMessages([])
        }
      })
    }

    return () => {
      if (socket) {
        socket.off('chat-sessions-updated')
        socket.off('new-customer-session')
        socket.off('chat-messages')
        socket.off('new-message')
        socket.off('customer-typing')
        socket.off('session-status-updated')
        socket.off('connect')
        socket.off('disconnect')
        socket.off('session-removed')
      }
    }
  }, [socket, userData, selectedSession])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !selectedSession) return

    socket.emit('send-admin-message', { 
      content: newMessage,
      sessionId: selectedSession.id
    })
    setNewMessage('')
    setIsTyping(false)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    // Split into lines and enforce 35 chars per line
    let lines = value.split(/\r?\n/).map(line => line.slice(0, 35));
    // Limit total lines to 5
    if (lines.length > 5) lines = lines.slice(0, 5);
    // Limit total chars to 50
    let total = lines.join('\n').slice(0, 50);
    // Re-split to enforce per-line after total limit
    lines = total.split(/\r?\n/).map(line => line.slice(0, 35));
    value = lines.join('\n');
    setNewMessage(value);
    setTextareaRows(Math.min(Math.max(lines.length, 1), 5));
    if (!isTyping && selectedSession) {
      setIsTyping(true);
      socket?.emit('admin-typing', { isTyping: true, sessionId: selectedSession.id });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('admin-typing', { isTyping: false, sessionId: selectedSession?.id });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // If Shift+Enter, allow line break (default behavior)
  };

  const selectSession = (session: ChatSession) => {
    console.log('Selecting session:', session.id)
    setSelectedSession(session)
    setMessages([])
    setCustomerTyping(false)
    
    // Mark session as read
    setSessions(prev => prev.map(s => 
      s.id === session.id ? { ...s, unreadCount: 0 } : s
    ))
    
    // Join the session room
    socket?.emit('join-session', session.id)
    
    // Request chat history
    socket?.emit('request-chat-history', { sessionId: session.id })
  }

  const closeSession = (sessionId: string) => {
    socket?.emit('close-chat-session', { sessionId })
  }

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false)
      disconnectSocket()
      setIsConnected(false)
    } else {
      setIsOpen(true)
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatLastMessage = (date?: Date) => {
    if (!date) return 'No messages'
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'waiting':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'closed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const handleDeleteHistory = (sessionId: string) => {
    setShowDeleteConfirm({ show: true, sessionId });
  };

  const confirmDeleteHistory = () => {
    if (showDeleteConfirm.sessionId && socket) {
      socket.emit('delete-session-history', { sessionId: showDeleteConfirm.sessionId });
      // Clear messages in UI if this session is selected
      if (selectedSession && selectedSession.id === showDeleteConfirm.sessionId) {
        setMessages([]);
      }
    }
    setShowDeleteConfirm({ show: false, sessionId: null });
  };

  const cancelDeleteHistory = () => {
    setShowDeleteConfirm({ show: false, sessionId: null });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare className="w-6 h-6" />
        {sessions.some(s => s.unreadCount > 0) && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
            {sessions.reduce((sum, s) => sum + s.unreadCount, 0)}
          </div>
        )}
      </motion.button>

      {/* Chat Manager */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-[800px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <div>
                  <span className="font-semibold">Admin Chat</span>
                  <div className="flex items-center space-x-1 text-xs opacity-90">
                    <Users className="w-3 h-3" />
                    <span>{sessions.length} sessions</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex-1 flex flex-row min-h-0">
                {/* Sessions List Sidebar */}
                <div className="w-64 min-w-[200px] max-w-[260px] border-r border-gray-200 flex flex-col bg-gray-50 h-full overflow-y-auto">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Active Sessions</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No active sessions</p>
                      </div>
                    ) : (
                      sessions.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => selectSession(session)}
                          className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${
                            selectedSession?.id === session.id ? 'bg-blue-100 border-blue-300' : ''
                          } flex items-center justify-between`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm truncate">{session.customerName}</span>
                              {session.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                  {session.unreadCount}
                                </span>
                              )}
                            </div>
                            {session.lastMessage && (
                              <div className="text-xs text-gray-400 mt-1">
                                {formatLastMessage(session.lastMessage)}
                              </div>
                            )}
                          </div>
                          <button
                            className="ml-2 p-1 text-gray-400 hover:text-red-600"
                            onClick={e => { e.stopPropagation(); handleDeleteHistory(session.id); }}
                            title="Delete History"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col h-full min-h-0">
                  {selectedSession ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{selectedSession.customerName}</h3>
                        </div>
                        <button
                          onClick={() => closeSession(selectedSession.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-white min-h-0">
                        {messages.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No messages yet</p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                                  message.senderRole === 'admin'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                              >
                                <div>{message.content}</div>
                                <div className="text-xs opacity-75 mt-1">
                                  {formatTime(message.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="p-3 border-t border-gray-200 bg-white">
                        <div className="flex space-x-2 items-center">
                          <textarea
                            value={newMessage}
                            onChange={handleTyping}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={textareaRows}
                            style={{ minHeight: '2.5rem', maxHeight: '12.5rem', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                            maxLength={50}
                          />
                          {/* Typing indicator bar */}
                          {customerTyping && (
                            <div className="flex items-center ml-2 h-6">
                              <div className="flex space-x-1">
                                <span className="block w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="block w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="block w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </div>
                            </div>
                          )}
                          <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Select a session to start chatting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-2">Delete Conversation History?</h3>
            <p className="mb-4 text-gray-600">Are you sure you want to delete this user's chat history? This cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDeleteHistory}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >Cancel</button>
              <button
                onClick={confirmDeleteHistory}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 