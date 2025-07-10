'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { getAuthHeaders } from '@/lib/auth-utils'

interface Skill {
  id: string
  name: string
  category: string
  level: number
  order: number
  icon?: string
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const categories = ['frontend', 'backend', 'database', 'devops']

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/skills', {
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        const data = await response.json()
        setSkills(data)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load skills' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (skillData: Omit<Skill, 'id'>) => {
    try {
      const response = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(skillData)
      })

      if (response.ok) {
        const newSkill = await response.json()
        setSkills(prev => [...prev, newSkill.skill])
        setMessage({ type: 'success', text: 'Skill created successfully!' })
        setShowForm(false)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to create skill' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    }
  }

  const handleUpdate = async (skillData: Skill) => {
    try {
      const response = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(skillData)
      })

      if (response.ok) {
        const updatedSkill = await response.json()
        setSkills(prev => prev.map(skill => 
          skill.id === updatedSkill.skill.id ? updatedSkill.skill : skill
        ))
        setMessage({ type: 'success', text: 'Skill updated successfully!' })
        setEditingSkill(null)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to update skill' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    }
  }

  const handleDelete = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const response = await fetch(`/api/admin/skills?id=${skillId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        setSkills(prev => prev.filter(skill => skill.id !== skillId))
        setMessage({ type: 'success', text: 'Skill deleted successfully!' })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to delete skill' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: 'from-blue-500 to-blue-600',
      backend: 'from-green-500 to-green-600',
      database: 'from-purple-500 to-purple-600',
      devops: 'from-orange-500 to-orange-600'
    }
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  if (loading) {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Skills Management</h2>
          <p className="text-gray-600">Manage your technical skills and expertise</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
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

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(skill.category)} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{skill.name.charAt(0)}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingSkill(skill)}
                  className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-gray-800 mb-2">{skill.name}</h3>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span className="capitalize">{skill.category}</span>
              <span>Level {skill.level}/10</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(skill.level / 10) * 100}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showForm || editingSkill) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingSkill(null)
                  }}
                  className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <SkillForm
                skill={editingSkill}
                onSubmit={(data) => {
                  if (editingSkill) {
                    handleUpdate({ ...data, id: editingSkill.id })
                  } else {
                    handleCreate(data)
                  }
                }}
                onCancel={() => {
                  setShowForm(false)
                  setEditingSkill(null)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface SkillFormProps {
  skill?: Skill | null
  onSubmit: (data: Omit<Skill, 'id'>) => void
  onCancel: () => void
}

function SkillForm({ skill, onSubmit, onCancel }: SkillFormProps) {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    category: skill?.category || 'frontend',
    level: skill?.level || 5,
    order: skill?.order || 0,
    icon: skill?.icon || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await onSubmit(formData)
    } finally {
      setSaving(false)
    }
  }

  const categories = ['frontend', 'backend', 'database', 'devops']

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skill Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="React"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skill Level (1-10)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.level}
          onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>1</span>
          <span>{formData.level}/10</span>
          <span>10</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Display Order
        </label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </form>
  )
} 