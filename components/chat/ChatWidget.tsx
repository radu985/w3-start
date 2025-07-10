'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Minimize2, Maximize2, Clock, CheckCircle, AlertCircle, Moon, Sun } from 'lucide-react'
import { initSocket, getSocket, disconnectSocket } from '@/lib/socket'
import { v4 as uuidv4 } from 'uuid'

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
}

interface ChatWidgetProps {
  userData?: {
    name?: string
    email?: string
    role?: string
  }
}

export default function ChatWidget({ userData }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [adminTyping, setAdminTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [chatStatus, setChatStatus] = useState<'waiting' | 'active' | 'closed'>('waiting')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [adminOnline, setAdminOnline] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const [textareaRows, setTextareaRows] = useState(1)
  const [customerId, setCustomerId] = useState<string | null>(null)

  const socket = getSocket()

  useEffect(() => {
    let storedId = null
    if (typeof window !== 'undefined') {
      storedId = localStorage.getItem('customerId')
      if (!storedId) {
        storedId = uuidv4()
        localStorage.setItem('customerId', storedId)
      }
    }
    setCustomerId(storedId)

    // Restore sessionId if present
    const storedSessionId = localStorage.getItem('customerSessionId')
    if (storedSessionId) {
      setSessionId(storedSessionId)
    }
  }, [])

  useEffect(() => {
    if (isOpen && !socket) {
      const newSocket = initSocket(userData)
      newSocket.connect()
    }

    if (socket && isOpen) {
      // Only emit events when socket is connected
      if (socket.connected) {
        console.log('Socket connected, joining customer chat')
        socket.emit('join-customer-chat', {
          customerId: customerId,
          customerName: userData?.name || userData?.email?.split('@')[0] || 'Anonymous'
        })
      } else {
        // Wait for connection before emitting
        socket.on('connect', () => {
          console.log('Socket connected, joining customer chat')
          socket.emit('join-customer-chat', {
            customerId: customerId,
            customerName: userData?.name || userData?.email?.split('@')[0] || 'Anonymous'
          })
        })
      }

      socket.on('chat-session-created', (session: ChatSession) => {
        console.log('Chat session created:', session)
        setSessionId(session.id)
        if (typeof window !== 'undefined') {
          localStorage.setItem('customerSessionId', session.id)
        }
        setChatStatus(session.status)
        setMessages([])
        setIsConnected(true)
      })

      socket.on('chat-session-updated', (session: ChatSession) => {
        console.log('Chat session updated:', session)
        setChatStatus(session.status)
      })

      socket.on('admin-joined', () => {
        console.log('Admin joined the chat')
        setAdminOnline(true)
        setChatStatus('active')
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: 'Admin has joined the chat. How can I help you today?',
          senderId: 'admin',
          senderName: 'Admin',
          senderRole: 'admin',
          timestamp: new Date()
        }])
      })

      socket.on('admin-left', () => {
        console.log('Admin left the chat')
        setAdminOnline(false)
        setChatStatus('waiting')
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: 'Admin has left the chat. Your message will be responded to shortly.',
          senderId: 'system',
          senderName: 'System',
          senderRole: 'admin',
          timestamp: new Date()
        }])
      })

      socket.on('new-message', (message: Message) => {
        console.log('New message received:', message)
        setMessages(prev => [...prev, message])
      })

      socket.on('admin-typing', (isTyping) => {
        console.log('Admin typing:', isTyping)
        setAdminTyping(isTyping)
      })

      socket.on('chat-history', (history: Message[]) => {
        console.log('Chat history received:', history.length, 'messages')
        setMessages(history)
      })

      socket.on('connect', () => {
        console.log('Socket connected')
        setIsConnected(true)
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
        setIsConnected(false)
      })

      socket.on('session-deleted', () => {
        setSessionId(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('customerSessionId')
        }
        setMessages([])
        setChatStatus('waiting')
      })
    }

    return () => {
      if (socket) {
        socket.off('chat-session-created')
        socket.off('chat-session-updated')
        socket.off('admin-joined')
        socket.off('admin-left')
        socket.off('new-message')
        socket.off('admin-typing')
        socket.off('chat-history')
        socket.off('connect')
        socket.off('disconnect')
        socket.off('session-deleted')
      }
    }
  }, [isOpen, socket, userData, customerId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !sessionId) return

    // Allow customers to send messages even when waiting for admin
    socket.emit('send-customer-message', { 
      content: newMessage,
      sessionId: sessionId
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
    if (!isTyping && sessionId) {
      setIsTyping(true);
      socket?.emit('customer-typing', { isTyping: true, sessionId });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('customer-typing', { isTyping: false, sessionId });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // If Shift+Enter, allow line break (default behavior)
  };

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

  const getStatusIcon = () => {
    switch (chatStatus) {
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

  const getStatusText = () => {
    switch (chatStatus) {
      case 'active':
        return adminOnline ? 'Admin is online' : 'Chat active'
      case 'waiting':
        return 'Waiting for admin'
      case 'closed':
        return 'Chat closed'
      default:
        return 'Connecting...'
    }
  }

  const canSendMessage = () => {
    return chatStatus !== 'closed' && sessionId && newMessage.trim()
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center ${
          isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-green-600 to-blue-600'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare className="w-6 h-6" />
        {messages.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
            {messages.length}
          </div>
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-24 right-6 w-96 rounded-2xl shadow-2xl border z-50 flex flex-col ${
              isDarkMode 
                ? 'bg-gray-900 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            {/* Header */}
            <div className={`p-4 rounded-t-2xl flex items-center justify-between ${
              isDarkMode 
                ? 'bg-gray-800 text-white' 
                : 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
            }`}>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-semibold">Chat with us</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
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
              <>
                {/* Messages */}
                <div className={`flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[500px] ${
                  isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No messages yet</p>
                        <p className="text-sm mt-1">Start a conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${message.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.senderRole === 'customer'
                            ? isDarkMode 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-500 text-white'
                            : isDarkMode
                              ? 'bg-gray-800 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <div className="text-sm">{message.content}</div>
                          <div className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-300' : message.senderRole === 'customer' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={`p-3 border-t ${
                  isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex space-x-2 items-center">
                    <textarea
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyDown={handleKeyPress}
                      placeholder="Type a message..."
                      className={`flex-1 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 resize-none ${
                        isDarkMode
                          ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500'
                          : 'bg-white text-gray-900 border border-gray-300 focus:ring-blue-500'
                      }`}
                      rows={textareaRows}
                      style={{ minHeight: '2.5rem', maxHeight: '12.5rem', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                      maxLength={50}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !isConnected}
                      className={`p-2 rounded-full transition-colors ${
                        !newMessage.trim() || !isConnected
                          ? isDarkMode 
                            ? 'bg-gray-700 text-gray-500' 
                            : 'bg-gray-100 text-gray-400'
                          : isDarkMode
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Typing indicator */}
                  {adminTyping && (
                    <div className="mt-2 flex items-center">
                      <div className="flex space-x-1">
                        <span className={`block w-2 h-2 rounded-full animate-bounce ${
                          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                        }`} style={{ animationDelay: '0ms' }}></span>
                        <span className={`block w-2 h-2 rounded-full animate-bounce ${
                          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                        }`} style={{ animationDelay: '150ms' }}></span>
                        <span className={`block w-2 h-2 rounded-full animate-bounce ${
                          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                        }`} style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 