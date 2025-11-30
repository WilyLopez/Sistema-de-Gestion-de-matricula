import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../utils/jwt.util";
import { ErrorAplicacion } from "./errores.middleware";
import { RolUsuario } from "@prisma/client";

export interface SolicitudAutenticada extends Request {
    usuario?: {
        id: string;
        correo: string;
        rol: RolUsuario;
    };
}

export const autenticar = async (
    req: SolicitudAutenticada,
    res: Response,
    next: NextFunction
) => {
    try {
        const encabezadoAuth = req.headers.authorization;

        if (!encabezadoAuth || !encabezadoAuth.startsWith("Bearer ")) {
            throw new ErrorAplicacion(401, "Token no proporcionado");
        }

        const token = encabezadoAuth.substring(7);
        const decodificado = verificarToken(token);

        req.usuario = {
            id: decodificado.usuarioId,
            correo: decodificado.correo,
            rol: decodificado.rol,
        };

        next();
    } catch (error) {
        if (error instanceof ErrorAplicacion) {
            return next(error);
        }
        next(new ErrorAplicacion(401, "Token inválido o expirado"));
    }
};

export const autorizar = (...roles: RolUsuario[]) => {
    return (req: SolicitudAutenticada, res: Response, next: NextFunction) => {
        if (!req.usuario) {
            return next(new ErrorAplicacion(401, "No autenticado"));
        }

        if (!roles.includes(req.usuario.rol)) {
            return next(
                new ErrorAplicacion(
                    403,
                    "No tienes permisos para realizar esta acción"
                )
            );
        }

        next();
    };
};
