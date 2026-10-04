import prisma from "./src/config/prisma.js";
import bcrypt from "bcrypt";

const createAdmin = async () => {
    try {
        const email = "admin@ticketsinseconds.com";
        const password = "Admin@12345";

        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            console.log("Email:", email);
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const admin = await prisma.user.create({
            data: {
                name: "Admin",
                email,
                password: hashedPassword,
                role: "ADMIN"
            }
        });

        console.log("=================================");
        console.log("ADMIN CREATED SUCCESSFULLY");
        console.log("=================================");
        console.log("Email:", admin.email);
        console.log("Password:", password);
        console.log("Role:", admin.role);
        console.log("=================================");

    } catch (error) {
        console.error("Failed to create admin:", error);
    } finally {
        await prisma.$disconnect();
    }
};

createAdmin();