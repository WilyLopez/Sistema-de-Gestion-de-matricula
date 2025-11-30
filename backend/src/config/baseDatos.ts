import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import { entorno } from "./entorno";

export const prisma = new PrismaClient({
    log:
        entorno.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
});

export const conectarMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(entorno.URI_MONGODB);
        console.log("MongoDB conectado exitosamente");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
        process.exit(1);
    }
};

export const conectarPostgreSQL = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL conectado exitosamente");
    } catch (error) {
        console.error("Error conectando a PostgreSQL:", error);
        process.exit(1);
    }
};

export const desconectarBaseDatos = async (): Promise<void> => {
    await prisma.$disconnect();
    await mongoose.disconnect();
    console.log("🔌 Bases de datos desconectadas");
};

process.on("SIGINT", async () => {
    await desconectarBaseDatos();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await desconectarBaseDatos();
    process.exit(0);
});
