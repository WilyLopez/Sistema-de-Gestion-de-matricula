import { z } from "zod";

export const esquemaInicioSesion = z.object({
    body: z.object({
        correo: z.string().email("Correo electrónico inválido"),
        contrasena: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres"),
    }),
});

export const esquemaRegistro = z.object({
    body: z.object({
        correo: z.string().email("Correo electrónico inválido"),
        contrasena: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres"),
        nombres: z
            .string()
            .min(2, "El nombre debe tener al menos 2 caracteres"),
        apellidos: z
            .string()
            .min(2, "El apellido debe tener al menos 2 caracteres"),
        rol: z.enum(["ADMIN", "DIRECTOR", "SECRETARIA"]).optional(),
    }),
});

export const esquemaTokenActualizacion = z.object({
    body: z.object({
        tokenActualizacion: z
            .string()
            .min(1, "Token de actualización es requerido"),
    }),
});

export type EntradaInicioSesion = z.infer<typeof esquemaInicioSesion>["body"];
export type EntradaRegistro = z.infer<typeof esquemaRegistro>["body"];
export type EntradaTokenActualizacion = z.infer<
    typeof esquemaTokenActualizacion
>["body"];
