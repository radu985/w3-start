'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Code, 
  FolderOpen, 
  Settings, 
  BarChart3, 
  Users, 
  MessageSquare,
  TrendingUp,
  Eye,
  Star,
  Mail
} from 'lucide-react'
import PortfolioForm from '@/components/admin/PortfolioForm'
import SkillsManager from '@/components/admin/SkillsManager'
import ProjectsManager from '@/components/admin/ProjectsManager'
import ContactManager from '@/components/admin/ContactManager'
import AdminChatManager from '@/components/admin/AdminChatManager'
import { getAuthUser, AuthUser } from '@/lib/auth-utils'
import AdminProfileForm from '@/components/admin/AdminProfileForm'

type TabType = 'overview' | 'portfolio' | 'skills' | 'projects' | 'contact' | 'profile'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [userData, setUserData] = useState<AuthUser | null>(null)

  useEffect(() => {
    const user = getAuthUser()
    setUserData(user)
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio', icon: User },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'profile', label: 'Profile', icon: Settings },
  ]

  const stats = [
    { label: 'Total Skills', value: '12', icon: Code, color: 'text-blue-600' },
    { label: 'Projects', value: '8', icon: FolderOpen, color: 'text-green-600' },
    { label: 'Messages', value: '24', icon: MessageSquare, color: 'text-purple-600' },
    { label: 'Portfolio Views', value: '1.2k', icon: Eye, color: 'text-orange-600' },
  ]

  const recentActivity = [
    { action: 'New project added', item: 'E-commerce Platform', time: '2 hours ago' },
    { action: 'Skill updated', item: 'React', time: '4 hours ago' },
    { action: 'Portfolio updated', item: 'About section', time: '1 day ago' },
    { action: 'New message received', item: 'From John Doe', time: '2 days ago' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {activity.action}: <span className="text-gray-600">{activity.item}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Edit Portfolio Info</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Manage Contact Info</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Code className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Manage Skills</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FolderOpen className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Add New Project</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Portfolio Views</span>
                    <span className="text-sm font-medium text-gray-800">+12% this week</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Message Response Rate</span>
                    <span className="text-sm font-medium text-gray-800">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      case 'portfolio':
        return <PortfolioForm />
      case 'contact':
        return <ContactManager />
      case 'skills':
        return <SkillsManager />
      case 'projects':
        return <ProjectsManager />
      case 'profile':
        return <AdminProfileForm userData={userData ?? undefined} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio and content</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Admin Chat Manager */}
      <AdminChatManager userData={userData || undefined} />
    </div>
  )
} 