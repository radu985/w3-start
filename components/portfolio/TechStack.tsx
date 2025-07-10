'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Monitor, Server, Wrench } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  icon?: string
  level: number
  order: number
}

export default function TechStack({ invertColors }: { invertColors?: boolean }) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      const data = await response.json()
      setSkills(data)
      console.log('Fetched👍👍 Skills:', data)
    } catch (error) {
      console.error('Error fetching skills:', error)
      // Use default skills if API fails
      setSkills(defaultSkills)
    } finally {
      setLoading(false)
    }
  }

  const defaultSkills: Skill[] = [
    // Frontend
    { id: '1', name: 'React', category: 'frontend', level: 9, order: 1 },
    { id: '2', name: 'Next.js', category: 'frontend', level: 8, order: 2 },
    { id: '3', name: 'TypeScript', category: 'frontend', level: 8, order: 3 },
    { id: '4', name: 'Tailwind CSS', category: 'frontend', level: 9, order: 4 },
    { id: '5', name: 'JavaScript (ES6+)', category: 'frontend', level: 9, order: 5 },
    { id: '6', name: 'HTML5 & CSS3', category: 'frontend', level: 9, order: 6 },
    
    // Backend
    { id: '7', name: 'Node.js', category: 'backend', level: 8, order: 1 },
    { id: '8', name: 'Express.js', category: 'backend', level: 8, order: 2 },
    { id: '9', name: 'FastAPI', category: 'backend', level: 7, order: 3 },
    { id: '10', name: 'REST APIs', category: 'backend', level: 9, order: 4 },
    { id: '11', name: 'JWT Authentication', category: 'backend', level: 8, order: 5 },
    
    // Database
    { id: '12', name: 'PostgreSQL', category: 'database', level: 8, order: 1 },
    { id: '13', name: 'MongoDB', category: 'database', level: 7, order: 2 },
    { id: '14', name: 'MySQL', category: 'database', level: 7, order: 3 },
    { id: '15', name: 'SQLite', category: 'database', level: 8, order: 4 },
    
    // DevOps & Tools
    { id: '16', name: 'Git & GitHub', category: 'devops', level: 9, order: 1 },
    { id: '17', name: 'Docker', category: 'devops', level: 7, order: 2 },
    { id: '18', name: 'Vercel', category: 'devops', level: 8, order: 3 },
    { id: '19', name: 'Railway', category: 'devops', level: 8, order: 4 },
    { id: '20', name: 'Postman', category: 'devops', level: 8, order: 5 },
    { id: '21', name: 'Figma', category: 'devops', level: 7, order: 6 }
  ]

  const categories = [
    { id: 'frontend', name: 'Frontend', icon: Monitor, color: 'from-blue-500 to-blue-600' },
    { id: 'backend', name: 'Backend', icon: Server, color: 'from-green-500 to-green-600' },
    { id: 'database', name: 'Database', icon: Code, color: 'from-purple-500 to-purple-600' },
    { id: 'devops', name: 'DevOps & Tools', icon: Wrench, color: 'from-orange-500 to-orange-600' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  if (loading) {
    return (
      <section id="skills" className={`section-padding ${invertColors ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </section>
    )
  }

  const currentSkills = (skills && skills.length > 0 ? skills : defaultSkills)
  return (
    <section id="skills" className={`section-padding ${invertColors ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${invertColors ? 'bg-gradient-to-r from-green-900 to-blue-900' : 'bg-gradient-to-r from-green-600 to-blue-600'}`}>
              <Code className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className={`text-4xl font-bold gradient-text mb-4 ${invertColors ? 'text-white' : ''}`}>
            Tech Stack
          </h2>
          
          <p className={`text-xl ${invertColors ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {categories.map((category) => {
            const categorySkills = currentSkills
              .filter(skill => skill.category === category.id)
              .sort((a, b) => a.order - b.order)

            return (
              <motion.div key={category.id} variants={itemVariants}>
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${invertColors ? 'from-gray-800 to-gray-900' : category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold ${invertColors ? 'text-white' : 'text-gray-800'}`}>{category.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 card-hover ${invertColors ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${invertColors ? 'bg-gradient-to-r from-gray-700 to-gray-900' : 'bg-gradient-to-r from-gray-100 to-gray-200'}`}>
                          <span className={`text-xl font-bold ${invertColors ? 'text-white' : 'text-gray-700'}`}>{skill.name.charAt(0)}</span>
                        </div>
                        <h4 className={`font-semibold mb-2 ${invertColors ? 'text-white' : 'text-gray-800'}`}>{skill.name}</h4>
                        <div className={`w-full rounded-full h-2 ${invertColors ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${invertColors ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}
                            style={{ width: `${(skill.level / 10) * 100}%` }}
                          ></div>
                        </div>
                        <p className={`text-sm mt-2 ${invertColors ? 'text-gray-300' : 'text-gray-600'}`}>Level {skill.level}/10</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}