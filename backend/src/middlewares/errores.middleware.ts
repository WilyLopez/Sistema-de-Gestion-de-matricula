import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class ErrorAplicacion extends Error {
    constructor(
        public codigoEstado: number,
        public mensaje: string,
        public esOperacional = true
    ) {
        super(mensaje);
        Object.setPrototypeOf(this, ErrorAplicacion.prototype);
    }
}

export const manejadorErrores = (
    err: Error | ErrorAplicacion | ZodError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error:", err);

    // Error de validación Zod
    if (err instanceof ZodError) {
        return res.status(400).json({
            exito: false,
            mensaje: "Error de validación",
            errores: err.errors.map((e) => ({
                campo: e.path.join("."),
                mensaje: e.message,
            })),
        });
    }

    // Errores de Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return res.status(409).json({
                exito: false,
                mensaje: "Ya existe un registro con estos datos",
                campo: err.meta?.target,
            });
        }
        if (err.code === "P2025") {
            return res.status(404).json({
                exito: false,
                mensaje: "Registro no encontrado",
            });
        }
    }

    // Error personalizado de la aplicación
    if (err instanceof ErrorAplicacion) {
        return res.status(err.codigoEstado).json({
            exito: false,
            mensaje: err.mensaje,
        });
    }

    // Error no manejado
    return res.status(500).json({
        exito: false,
        mensaje: "Error interno del servidor",
        ...(process.env.NODE_ENV === "development" && { pila: err.stack }),
    });
};

export const manejadorNoEncontrado = (req: Request, res: Response) => {
    res.status(404).json({
        exito: false,
        mensaje: `Ruta no encontrada: ${req.method} ${req.path}`,
    });
};

export const manejadorAsincrono = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
