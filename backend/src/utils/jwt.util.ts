import jwt from "jsonwebtoken";
import { entorno } from "../config/entorno";
import { RolUsuario } from "@prisma/client";

export interface CargaJwt {
    usuarioId: string;
    correo: string;
    rol: RolUsuario;
}

export const generarToken = (carga: CargaJwt): string => {
    return jwt.sign(carga, entorno.SECRETO_JWT, {
        expiresIn: entorno.EXPIRACION_JWT,
    });
};

export const generarTokenActualizacion = (carga: CargaJwt): string => {
    return jwt.sign(carga, entorno.SECRETO_REFRESH_JWT, {
        expiresIn: entorno.EXPIRACION_REFRESH_JWT,
    });
};

export const verificarToken = (token: string): CargaJwt => {
    try {
        return jwt.verify(token, entorno.SECRETO_JWT) as CargaJwt;
    } catch (error) {
        throw new Error("Token inválido o expirado");
    }
};

export const verificarTokenActualizacion = (token: string): CargaJwt => {
    try {
        return jwt.verify(token, entorno.SECRETO_REFRESH_JWT) as CargaJwt;
    } catch (error) {
        throw new Error("Token de actualización inválido o expirado");
    }
};
