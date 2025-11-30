import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { entorno } from "../config/entorno";
import { RolUsuario } from "@prisma/client";
import { StringValue } from "ms";

export interface CargaJwt {
    usuarioId: string;
    correo: string;
    rol: RolUsuario;
}

const opcionesAcceso: SignOptions = {
    expiresIn: entorno.EXPIRACION_JWT as StringValue,
};

const opcionesRefresh: SignOptions = {
    expiresIn: entorno.EXPIRACION_REFRESH_JWT as StringValue,
};

export const generarToken = (carga: CargaJwt): string =>
    jwt.sign(carga, entorno.SECRETO_JWT as Secret, opcionesAcceso);

export const generarTokenActualizacion = (carga: CargaJwt): string =>
    jwt.sign(carga, entorno.SECRETO_REFRESH_JWT as Secret, opcionesRefresh);

export const verificarToken = (token: string): CargaJwt =>
    jwt.verify(token, entorno.SECRETO_JWT as Secret) as CargaJwt;

export const verificarTokenActualizacion = (token: string): CargaJwt =>
    jwt.verify(token, entorno.SECRETO_REFRESH_JWT as Secret) as CargaJwt;
