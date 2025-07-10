const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
    console.log("Starting database initialization...")

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)
    const adminUser = await prisma.user.upsert({
        where: { email: "admin@portfolio.com" },
        update: {},
        create: {
            email: "admin@portfolio.com",
            password: hashedPassword,
            role: "admin",
        },
    })
    console.log("Admin user created:", adminUser.email)

    // Create portfolio data
    const portfolio = await prisma.portfolio.upsert({
        where: { id: "default-portfolio" },
        update: {},
        create: {
            id: "default-portfolio",
            title: "Full Stack Developer Portfolio",
            subtitle: "Building modern web applications",
            aboutMe:
                "Hello! I'm a Full Stack Developer based in Cali, Colombia, with a deep passion for technology and software craftsmanship. I graduated from Universidad del Valle (University of the Valley) with a degree in Software Engineering, where I built a strong foundation in full cycle application development, algorithms, and systems design.",
            location: "Cali, Colombia",
            email: "www_star@email.com",
            github: "github.com/radu985",
            linkedin: "linkedin.com/in/yourprofile",
            website: "yourdomain.com",
        },
    })
    console.log("Portfolio data created")

    // Create skills
    const skills = [
        // Frontend
        { name: "React", category: "frontend", level: 9, order: 1 },
        { name: "Next.js", category: "frontend", level: 8, order: 2 },
        { name: "TypeScript", category: "frontend", level: 8, order: 3 },
        { name: "Tailwind CSS", category: "frontend", level: 9, order: 4 },
        { name: "JavaScript (ES6+)", category: "frontend", level: 9, order: 5 },
        { name: "HTML5 & CSS3", category: "frontend", level: 9, order: 6 },

        // Backend
        { name: "Node.js", category: "backend", level: 8, order: 1 },
        { name: "Express.js", category: "backend", level: 8, order: 2 },
        { name: "FastAPI", category: "backend", level: 7, order: 3 },
        { name: "REST APIs", category: "backend", level: 9, order: 4 },
        { name: "JWT Authentication", category: "backend", level: 8, order: 5 },

        // Database
        { name: "PostgreSQL", category: "database", level: 8, order: 1 },
        { name: "MongoDB", category: "database", level: 7, order: 2 },
        { name: "MySQL", category: "database", level: 7, order: 3 },
        { name: "SQLite", category: "database", level: 8, order: 4 },

        // DevOps & Tools
        { name: "Git & GitHub", category: "devops", level: 9, order: 1 },
        { name: "Docker", category: "devops", level: 7, order: 2 },
        { name: "Vercel", category: "devops", level: 8, order: 3 },
        { name: "Railway", category: "devops", level: 8, order: 4 },
        { name: "Postman", category: "devops", level: 8, order: 5 },
        { name: "Figma", category: "devops", level: 7, order: 6 },
    ]

    for (const skill of skills) {
        try {
            await prisma.skill.create({
                data: skill,
            })
        } catch (error) {
            // Skill might already exist, continue
            console.log(
                `Skill ${skill.name} already exists or error:`,
                error.message
            )
        }
    }
    console.log(`${skills.length} skills created`)

    // Create projects
    const projects = [
        {
            title: "Custom CRM for Logistics Company",
            description:
                "Built a feature-rich internal CRM platform to manage leads, shipments, and team roles. Integrated role-based authentication, reporting dashboards, and deployment using Docker.",
            technologies: "React, Node.js, PostgreSQL, Tailwind",
            liveUrl: "#",
            githubUrl: "#",
            featured: true,
            order: 1,
        },
        {
            title: "E-Commerce Platform for Handmade Goods",
            description:
                "Created a full-stack online store with product filters, cart functionality, secure checkout, and Stripe payment integration. Hosted on Vercel with optimized performance and SEO.",
            technologies: "Next.js, MongoDB, Stripe API",
            liveUrl: "#",
            githubUrl: "#",
            featured: true,
            order: 2,
        },
        {
            title: "Internship Job Board",
            description:
                "Collaborated on a career portal for students and companies. Implemented job search, resume uploads, notifications, and admin controls. Designed backend models and frontend UI.",
            technologies: "React, Django REST API, PostgreSQL",
            liveUrl: "#",
            githubUrl: "#",
            featured: true,
            order: 3,
        },
        {
            title: "Real-time Dashboard",
            description:
                "Developed a real-time analytics dashboard with live data visualization, user management, and customizable widgets.",
            technologies: "React, Socket.io, Chart.js, Express",
            liveUrl: "#",
            githubUrl: "#",
            featured: false,
            order: 4,
        },
        {
            title: "Task Management App",
            description:
                "Built a collaborative task management application with real-time updates, team collaboration, and progress tracking.",
            technologies: "Next.js, Prisma, PostgreSQL, Tailwind",
            liveUrl: "#",
            githubUrl: "#",
            featured: false,
            order: 5,
        },
        {
            title: "Weather API Integration",
            description:
                "Created a weather application with location-based forecasts, historical data, and interactive maps.",
            technologies: "React, OpenWeather API, Leaflet Maps",
            liveUrl: "#",
            githubUrl: "#",
            featured: false,
            order: 6,
        },
    ]

    for (const project of projects) {
        try {
            await prisma.project.create({
                data: project,
            })
        } catch (error) {
            // Project might already exist, continue
            console.log(
                `Project ${project.title} already exists or error:`,
                error.message
            )
        }
    }
    console.log(`${projects.length} projects created`)

    console.log("Database initialization completed successfully!")
}

main()
    .catch(e => {
        console.error("Error during database initialization:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
