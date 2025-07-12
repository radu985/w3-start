"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    User,
    Code,
    Briefcase,
    MessageSquare,
    Github,
    Linkedin,
    Mail,
    Globe,
    MapPin,
    Sun,
    Moon,
    Layout,
} from "lucide-react"
import AboutMe from "@/components/portfolio/AboutMe"
import TechStack from "@/components/portfolio/TechStack"
import Projects from "@/components/portfolio/Projects"
import Contact from "@/components/portfolio/Contact"
import ChatWidget from "@/components/chat/ChatWidget"

interface PortfolioData {
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

export default function PortfolioPage() {
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
        null
    )
    const [loading, setLoading] = useState(true)
    const [headerNavDark, setHeaderNavDark] = useState(false)
    const [fullPageDark, setFullPageDark] = useState(false)
    const [invertColors, setInvertColors] = useState(false)

    useEffect(() => {
        fetchPortfolioData()
    }, [])

    const fetchPortfolioData = async () => {
        try {
            const response = await fetch("/api/portfolio")
            const data = await response.json()
            setPortfolioData(data)
        } catch (error) {
            console.error("Error fetching portfolio data:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const defaultData: PortfolioData = {
        title: "Invisible 💫",
        subtitle: "Building modern web applications",
        aboutMe: `I’m a full stack developer with a strong academic background in software engineering and a deep-rooted passion for technology. Growing up in a family of tech enthusiasts, I was exposed early to the transformative power of software and digital tools. That environment naturally led me to pursue a career in tech, where I combine curiosity, creativity, and problem-solving skills to deliver modern, high-quality web applications.
💯% focus on your project
Transparent, daily progress updates
Free revisions until you’re fully satisfied`,
        location: "Cali, Colombia",
        email: "www_star@email.com",
        github: "github.com/radu985",
        linkedin: "linkedin.com/in/yourprofile",
        website: "yourdomain.com",
    }

    const data = portfolioData || defaultData

    const isHeaderNavDark = fullPageDark ? true : headerNavDark

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${
                fullPageDark
                    ? "bg-gray-900 text-white"
                    : "bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900"
            }`}
        >
            {/* Header */}
            <header
                className={`${
                    isHeaderNavDark
                        ? "bg-gray-900 shadow-md text-white"
                        : "bg-white shadow-sm text-gray-900"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    isHeaderNavDark
                                        ? "bg-gradient-to-r from-blue-900 to-purple-900"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600"
                                }`}
                            >
                                <img src="https://avataaars.io/?avatarStyle=Circle&topType=Hat&accessoriesType=Kurt&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=AngryNatural&mouthType=Smile&skinColor=Light" />
                            </div>
                            <div>
                                <h1
                                    className={`text-2xl font-bold gradient-text ${
                                        isHeaderNavDark ? "text-white" : ""
                                    }`}
                                >
                                    {data.title}
                                </h1>
                                <p
                                    className={`${
                                        isHeaderNavDark
                                            ? "text-gray-300"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {data.subtitle}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div
                                className={`flex items-center space-x-2 ${
                                    isHeaderNavDark
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                }`}
                            >
                                <MapPin className="w-4 h-4" />
                                <span>{data.location}</span>
                            </div>
                            <div className="flex space-x-2">
                                {data.github && (
                                    <a
                                        href={`https://${data.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-2 ${
                                            isHeaderNavDark
                                                ? "text-gray-300 hover:text-white"
                                                : "text-gray-600 hover:text-gray-900"
                                        } transition-colors`}
                                    >
                                        <Github className="w-5 h-5" />
                                    </a>
                                )}
                                {data.linkedin && (
                                    <a
                                        href={`https://${data.linkedin}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-2 ${
                                            isHeaderNavDark
                                                ? "text-gray-300 hover:text-blue-400"
                                                : "text-gray-600 hover:text-blue-600"
                                        } transition-colors`}
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {data.website && (
                                    <a
                                        href={`https://${data.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-2 ${
                                            isHeaderNavDark
                                                ? "text-gray-300 hover:text-green-400"
                                                : "text-gray-600 hover:text-green-600"
                                        } transition-colors`}
                                    >
                                        <Globe className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                            {/* Current View button: header/nav only */}
                            <button
                                onClick={() => setHeaderNavDark(v => !v)}
                                className={`ml-4 p-2 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    isHeaderNavDark
                                        ? "bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700"
                                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                                }`}
                                title={
                                    isHeaderNavDark
                                        ? "Switch header/nav to light"
                                        : "Switch header/nav to black"
                                }
                                aria-label="Current View"
                                disabled={fullPageDark}
                            >
                                {isHeaderNavDark ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav
                className={`${
                    isHeaderNavDark
                        ? "bg-gray-900 border-b border-gray-800 text-white"
                        : "bg-white border-b text-gray-900"
                } sticky top-0 z-10`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {[
                            { id: "about", label: "About Me", icon: User },
                            { id: "skills", label: "Tech Stack", icon: Code },
                            {
                                id: "projects",
                                label: "Projects",
                                icon: Briefcase,
                            },
                            {
                                id: "contact",
                                label: "Contact",
                                icon: MessageSquare,
                            },
                        ].map(item => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={`flex items-center space-x-2 py-4 px-2 border-b-2 border-transparent transition-colors ${
                                    isHeaderNavDark
                                        ? "hover:border-blue-400 text-gray-200 hover:text-white"
                                        : "hover:border-blue-500 text-gray-700 hover:text-black"
                                }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                <AboutMe data={data} invertColors={invertColors} />
                <TechStack invertColors={invertColors} />
                <Projects invertColors={invertColors} />
                <Contact data={data} invertColors={invertColors} />
            </main>

            {/* Chat Widget */}
            <ChatWidget />
        </div>
    )
}
