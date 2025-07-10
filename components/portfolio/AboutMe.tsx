'use client'

import { motion } from 'framer-motion'
import { User, GraduationCap, MapPin, Heart } from 'lucide-react'

interface AboutMeProps {
  data: {
    aboutMe: string
    location: string
  },
  invertColors?: boolean
}

export default function AboutMe({ data, invertColors }: AboutMeProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="about" className={`section-padding ${invertColors ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${invertColors ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
              <User className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className={`text-4xl font-bold gradient-text mb-4 ${invertColors ? 'text-white' : ''}`}>
            About Me
          </motion.h2>
          
          <motion.p variants={itemVariants} className={`text-xl ${invertColors ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Passionate about creating innovative digital solutions
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="prose prose-lg">
              <p className={`${invertColors ? 'text-gray-200' : 'text-gray-700'} leading-relaxed`}>
                {data.aboutMe}
              </p>
              
            </div>

            <div className="flex flex-wrap gap-4">
              <div className={`flex items-center space-x-2 ${invertColors ? 'text-gray-300' : 'text-gray-600'}`}>
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Software Engineering Degree</span>
              </div>
              <div className={`flex items-center space-x-2 ${invertColors ? 'text-gray-300' : 'text-gray-600'}`}>
                <MapPin className="w-5 h-5 text-green-600" />
                <span>{data.location}</span>
              </div>
              <div className={`flex items-center space-x-2 ${invertColors ? 'text-gray-300' : 'text-gray-600'}`}>
                <Heart className="w-5 h-5 text-red-600" />
                <span>Full Stack Development</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className={`${invertColors ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} rounded-2xl p-8`}>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Years Experience', value: '3+', color: invertColors ? 'from-blue-900 to-blue-800' : 'from-blue-500 to-blue-600' },
                  { label: 'Projects Completed', value: '20+', color: invertColors ? 'from-purple-900 to-purple-800' : 'from-purple-500 to-purple-600' },
                  { label: 'Technologies', value: '15+', color: invertColors ? 'from-green-900 to-green-800' : 'from-green-500 to-green-600' },
                  { label: 'Happy Clients', value: '10+', color: invertColors ? 'from-orange-900 to-orange-800' : 'from-orange-500 to-orange-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-white font-bold text-xl">{stat.value}</span>
                    </div>
                    <p className={`${invertColors ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 