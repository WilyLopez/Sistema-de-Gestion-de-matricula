import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const esquemaEntorno = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PUERTO: z.string().transform(Number).default("3000"),
    PREFIJO_API: z.string().default("/api/v1"),

    URL_BASE_DATOS: z.string().min(1, "URL_BASE_DATOS es requerida"),
    URI_MONGODB: z.string().min(1, "URI_MONGODB es requerida"),

    SECRETO_JWT: z
        .string()
        .min(32, "SECRETO_JWT debe tener al menos 32 caracteres"),
    EXPIRACION_JWT: z.string().default("24h"),
    SECRETO_REFRESH_JWT: z
        .string()
        .min(32, "SECRETO_REFRESH_JWT debe tener al menos 32 caracteres"),
    EXPIRACION_REFRESH_JWT: z.string().default("7d"),

    URL_FRONTEND: z.string().url().default("http://localhost:3001"),

    VENTANA_LIMITE_MS: z.string().transform(Number).default("900000"),
    MAX_PETICIONES: z.string().transform(Number).default("100"),

    TAMANO_MAX_ARCHIVO: z.string().transform(Number).default("5242880"),
});

const analizarEntorno = () => {
    try {
        return esquemaEntorno.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error(" Error en variables de entorno:");
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join(".")}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};

export const entorno = analizarEntorno();

export default entorno;
