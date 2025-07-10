'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Edit, Loader2, CheckCircle, AlertCircle, Mail, MapPin, Github, Linkedin, Globe, Trash2 } from 'lucide-react'
import { getAuthHeaders } from '@/lib/auth-utils'

interface ContactData {
  id: string
  title: string
  subtitle: string
  aboutMe: string
  location: string
  email: string
  github?: string
  linkedin?: string
  website?: string
  avatar?: string
}

export default function ContactManager() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState<Partial<ContactData>>({})
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/portfolio', {
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        const data = await response.json()
        setContactData(data)
        setFormData(data)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load contact information' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedData = await response.json()
        setContactData(updatedData.portfolio)
        setMessage({ type: 'success', text: 'Contact information updated successfully! The About Me content has been completely replaced.' })
        setEditing(false)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to update contact information' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearAboutMe = () => {
    setFormData(prev => ({
      ...prev,
      aboutMe: ''
    }))
    setShowConfirmClear(false)
  }

  if (loading && !contactData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Information</h2>
          <p className="text-gray-600">Manage your contact details and social media links</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Contact</span>
          </button>
        )}
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {editing ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full Stack Developer Portfolio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Building modern web applications"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      About Me
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmClear(true)}
                      className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      value={formData.aboutMe || ''}
                      onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell visitors about yourself... (This will completely replace the existing content)"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {formData.aboutMe?.length || 0} characters
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ Editing this field will completely replace the existing About Me content
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub Profile
                  </label>
                  <input
                    type="text"
                    value={formData.github || ''}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="github.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin || ''}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Website
                  </label>
                  <input
                    type="text"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="yourdomain.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setFormData(contactData || {})
                  setMessage(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information Display */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Portfolio Title</label>
                  <p className="text-gray-800 font-medium">{contactData?.title || 'Not set'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Subtitle</label>
                  <p className="text-gray-800 font-medium">{contactData?.subtitle || 'Not set'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">About Me</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {contactData?.aboutMe || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information Display */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-800 font-medium">{contactData?.email || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Location</label>
                      <p className="text-gray-800 font-medium">{contactData?.location || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Github className="w-4 h-4 text-gray-500" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">GitHub</label>
                      <p className="text-gray-800 font-medium">{contactData?.github || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-4 h-4 text-gray-500" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">LinkedIn</label>
                      <p className="text-gray-800 font-medium">{contactData?.linkedin || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Website</label>
                      <p className="text-gray-800 font-medium">{contactData?.website || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Clearing About Me */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Clear About Me Content?</h3>
              <p className="text-gray-600 mb-6">
                This will completely remove all existing About Me content. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAboutMe}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear Content
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 