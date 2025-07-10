"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    Briefcase,
    ExternalLink,
    Github,
    Truck,
    ShoppingCart,
    GraduationCap,
} from "lucide-react"

interface Project {
    id: string
    title: string
    description: string
    technologies: string[]
    liveUrl?: string
    githubUrl?: string
    imageUrl?: string
    featured: boolean
    order: number
}

export default function Projects({ invertColors }: { invertColors?: boolean }) {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects")
            const data = await response.json()
            setProjects(data)
        } catch (error) {
            console.error("Error fetching projects:", error)
            // Use default projects if API fails
            setProjects(defaultProjects)
        } finally {
            setLoading(false)
        }
    }

    const defaultProjects: Project[] = [
        {
            id: "1",
            title: "Custom CRM for Logistics Company",
            description:
                "Built a feature-rich internal CRM platform to manage leads, shipments, and team roles. Integrated role-based authentication, reporting dashboards, and deployment using Docker.",
            technologies: ["React", "Node.js", "PostgreSQL", "Tailwind"],
            liveUrl: "#",
            githubUrl: "#",
            featured: true,
            order: 1,
        },
        {
            id: "2",
            title: "E-Commerce Platform for Handmade Goods",
            description:
                "Created a full-stack online store with product filters, cart functionality, secure checkout, and Stripe payment integration. Hosted on Vercel with optimized performance and SEO.",
            technologies: ["Next.js", "MongoDB", "Stripe API"],
            liveUrl: "#",
            githubUrl: "#",
            featured: true,
            order: 2,
        },
        {
            id: "3",
            title: "Internship Job Board",
            description:
                "Collaborated on a career portal for students and companies. Implemented job search, resume uploads, notifications, and admin controls. Designed backend models and frontend UI.",
            technologies: ["React", "Django REST API", "PostgreSQL"],
            liveUrl: "#",
            githubUrl: "#",
            featured: true,
            order: 3,
        },
        {
            id: "4",
            title: "Real-time Dashboard",
            description:
                "Developed a real-time analytics dashboard with live data visualization, user management, and customizable widgets.",
            technologies: ["React", "Socket.io", "Chart.js", "Express"],
            liveUrl: "#",
            githubUrl: "#",
            featured: false,
            order: 4,
        },
        {
            id: "5",
            title: "Task Management App",
            description:
                "Built a collaborative task management application with real-time updates, team collaboration, and progress tracking.",
            technologies: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
            liveUrl: "#",
            githubUrl: "#",
            featured: false,
            order: 5,
        },
        {
            id: "6",
            title: "Weather API Integration",
            description:
                "Created a weather application with location-based forecasts, historical data, and interactive maps.",
            technologies: ["React", "OpenWeather API", "Leaflet Maps"],
            liveUrl: "#",
            githubUrl: "#",
            featured: false,
            order: 6,
        },
    ]

    const getProjectIcon = (title: string) => {
        if (
            title.toLowerCase().includes("crm") ||
            title.toLowerCase().includes("logistics")
        ) {
            return Truck
        }
        if (
            title.toLowerCase().includes("e-commerce") ||
            title.toLowerCase().includes("store")
        ) {
            return ShoppingCart
        }
        if (
            title.toLowerCase().includes("job") ||
            title.toLowerCase().includes("internship")
        ) {
            return GraduationCap
        }
        return Briefcase
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
            },
        },
    }

    if (loading) {
        return (
            <section
                id="projects"
                className={`section-padding ${
                    invertColors
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                }`}
            >
                <div className="max-w-6xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </section>
        )
    }

    const currentProjects = projects.length > 0 ? projects : defaultProjects
    const featuredProjects = currentProjects
        .filter(p => p.featured)
        .sort((a, b) => a.order - b.order)
    const otherProjects = currentProjects
        .filter(p => !p.featured)
        .sort((a, b) => a.order - b.order)

    return (
        <section
            id="projects"
            className={`section-padding ${
                invertColors
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900"
            }`}
        >
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex justify-center mb-6">
                        <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center ${
                                invertColors
                                    ? "bg-gradient-to-r from-purple-900 to-pink-900"
                                    : "bg-gradient-to-r from-purple-600 to-pink-600"
                            }`}
                        >
                            <Briefcase className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h2
                        className={`text-4xl font-bold gradient-text mb-4 ${
                            invertColors ? "text-white" : ""
                        }`}
                    >
                        Selected Projects
                    </h2>

                    <p
                        className={`text-xl ${
                            invertColors ? "text-gray-300" : "text-gray-600"
                        } max-w-3xl mx-auto`}
                    >
                        Showcasing my best work and technical expertise
                    </p>
                </motion.div>

                {/* Featured Projects */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h3
                        className={`text-2xl font-bold mb-8 text-center ${
                            invertColors ? "text-white" : "text-gray-800"
                        }`}
                    >
                        Featured Projects
                    </h3>
                    <div className="grid lg:grid-cols-2 gap-8">
                        {featuredProjects.map((project, index) => {
                            const IconComponent = getProjectIcon(project.title)
                            return (
                                <motion.div
                                    key={project.id}
                                    variants={itemVariants}
                                    className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 card-hover border ${
                                        invertColors
                                            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                                            : "bg-gradient-to-br from-gray-50 to-white border-gray-100"
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div
                                            className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                                invertColors
                                                    ? "bg-gradient-to-r from-blue-900 to-purple-900"
                                                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                                            }`}
                                        >
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex space-x-2">
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    <Github className="w-5 h-5" />
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-bold text-gray-800 mb-3">
                                        {project.title}
                                    </h4>
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(project.technologies || []).map(
                                            (tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                                                >
                                                    {tech}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Other Projects */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        More Projects
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherProjects.map((project, index) => {
                            const IconComponent = getProjectIcon(project.title)
                            return (
                                <motion.div
                                    key={project.id}
                                    variants={itemVariants}
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 card-hover border border-gray-100"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex space-x-2">
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                        {project.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1">
                                        {(project.technologies || [])
                                            .slice(0, 3)
                                            .map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        {(project.technologies || []).length >
                                            3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                                +
                                                {(project.technologies || [])
                                                    .length - 3}{" "}
                                                more
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
