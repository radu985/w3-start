export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
    const portfolio = await prisma.portfolio.findFirst()
    if (!portfolio) {
        return NextResponse.json({
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
            avatar: null,
        })
    }
    return NextResponse.json(portfolio)
}

//
