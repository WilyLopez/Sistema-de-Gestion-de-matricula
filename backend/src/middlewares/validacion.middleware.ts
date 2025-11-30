import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export const validar = (esquema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await esquema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    exito: false,
                    mensaje: "Error de validación",
                    errores: error.issues.map((e) => ({
                        campo: e.path.join("."),
                        mensaje: e.message,
                    })),
                });
            }
            next(error);
        }
    };
};
