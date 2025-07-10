'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Mail, Github, Linkedin, Globe, MapPin, Phone, Calendar } from 'lucide-react'

interface ContactProps {
  data: {
    email: string
    github?: string
    linkedin?: string
    website?: string
    location: string
  },
  invertColors?: boolean
}

export default function Contact({ data, invertColors }: ContactProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: data.email,
      href: `mailto:${data.email}`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: data.location,
      href: null,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: data.github || 'github.com/radu985',
      href: `https://${data.github || 'github.com/radu985'}`,
      color: 'from-gray-700 to-gray-800'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: data.linkedin || 'linkedin.com/in/yourprofile',
      href: `https://${data.linkedin || 'linkedin.com/in/yourprofile'}`,
      color: 'from-blue-600 to-blue-700'
    }
  ]

  return (
    <section id="contact" className={`section-padding ${invertColors ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${invertColors ? 'bg-gradient-to-r from-pink-900 to-orange-900' : 'bg-gradient-to-r from-pink-600 to-orange-600'}`}>
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className={`text-4xl font-bold gradient-text mb-4 ${invertColors ? 'text-white' : ''}`}>
            Let's Work Together
          </motion.h2>
          
          <motion.p variants={itemVariants} className={`text-xl ${invertColors ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto mb-8`}>
            I'm currently available for freelance projects, remote positions, and technical collaborations. 
            Whether you're building a startup MVP, need a web app built from scratch, or want to improve 
            an existing product — I'm here to help.
          </motion.p>

          <motion.div variants={itemVariants} className={`${invertColors ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg max-w-4xl mx-auto`}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-2xl font-bold mb-6 ${invertColors ? 'text-white' : 'text-gray-800'}`}>Get In Touch</h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${invertColors ? 'from-gray-700 to-gray-900' : info.color} rounded-lg flex items-center justify-center`}>
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${invertColors ? 'text-gray-300' : 'text-gray-600'}`}>{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium transition-colors ${invertColors ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'}`}
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className={`font-medium ${invertColors ? 'text-white' : 'text-gray-800'}`}>{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`text-2xl font-bold mb-6 ${invertColors ? 'text-white' : 'text-gray-800'}`}>What I Offer</h3>
                <div className="space-y-4">
                  {[
                    { icon: Calendar, text: 'Quick project turnaround', color: 'from-purple-500 to-purple-600' },
                    { icon: MessageSquare, text: 'Clear communication', color: 'from-green-500 to-green-600' },
                    { icon: Globe, text: 'Modern web solutions', color: 'from-blue-500 to-blue-600' },
                    { icon: Mail, text: 'Ongoing support', color: 'from-orange-500 to-orange-600' }
                  ].map((service, index) => (
                    <motion.div
                      key={service.text}
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${invertColors ? 'from-gray-700 to-gray-900' : service.color} rounded-lg flex items-center justify-center`}>
                        <service.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className={`font-medium ${invertColors ? 'text-gray-200' : 'text-gray-700'}`}>{service.text}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <a
                    href={`mailto:${data.email}?subject=Project Inquiry&body=Hi! I'm interested in working with you on a project.`}
                    className={`inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <Mail className="w-5 h-5" />
                    <span>Start a Project</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Languages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className={`text-2xl font-bold mb-8 ${invertColors ? 'text-white' : 'text-gray-800'}`}>Languages</h3>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${invertColors ? 'from-red-900 to-red-800' : 'from-red-500 to-red-600'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <span className="text-white font-bold text-lg">🇪🇸</span>
              </div>
              <p className={`font-semibold ${invertColors ? 'text-white' : 'text-gray-800'}`}>Spanish</p>
              <p className={`text-sm ${invertColors ? 'text-gray-300' : 'text-gray-600'}`}>Native</p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${invertColors ? 'from-blue-900 to-blue-800' : 'from-blue-500 to-blue-600'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <span className="text-white font-bold text-lg">🇬🇧</span>
              </div>
              <p className={`font-semibold ${invertColors ? 'text-white' : 'text-gray-800'}`}>English</p>
              <p className={`text-sm ${invertColors ? 'text-gray-300' : 'text-gray-600'}`}>Professional (B2-C1)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 