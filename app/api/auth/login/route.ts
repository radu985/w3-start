export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        // Check if any users exist; if not, create a default admin
        const userCount = await prisma.user.count()
        if (userCount === 0) {
            const bcrypt = require("bcryptjs")
            const hashedPassword = await bcrypt.hash("admin123", 10) // Hash the password for the default admin
            await prisma.user.create({
                data: {
                    email: "admin@portfolio",
                    password: hashedPassword,
                    name:"admin",
                    role: "admin",
                },
            })
            console.log("Default admin user created")
        }

        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            )
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })
        console.log(user, "👤👤")
        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            )
        }

        // Check if user is admin
        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Access denied. Admin privileges required." },
                { status: 403 }
            )
        }

        // Verify password
        if (!user.password) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            )
        }
        const isValidPassword = await verifyPassword(password, user.password)
        console.log(isValidPassword, "🔑🔑")
        if (!isValidPassword) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = generateToken(user.id, user.role)

        // Return user data (without password) and token
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({
            message: "Login successful",
            token,
            user: userWithoutPassword,
        })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
