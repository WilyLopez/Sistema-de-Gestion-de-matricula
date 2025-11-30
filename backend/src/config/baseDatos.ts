import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import { entorno } from "./entorno";

// Prisma Client para PostgreSQL
export const prisma = new PrismaClient({
    log:
        entorno.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
});

// Conexión a MongoDB
export const conectarMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(entorno.URI_MONGODB);
        console.log("MongoDB conectado exitosamente");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
        process.exit(1);
    }
};

// Función para verificar conexión PostgreSQL
export const conectarPostgreSQL = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL conectado exitosamente");
    } catch (error) {
        console.error("Error conectando a PostgreSQL:", error);
        process.exit(1);
    }
};

// Cerrar conexiones
export const desconectarBaseDatos = async (): Promise<void> => {
    await prisma.$disconnect();
    await mongoose.disconnect();
    console.log("🔌 Bases de datos desconectadas");
};

// Manejo de señales de terminación
process.on("SIGINT", async () => {
    await desconectarBaseDatos();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await desconectarBaseDatos();
    process.exit(0);
});
