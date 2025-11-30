import { prisma } from "../../config/baseDatos";
import {
    encriptarContrasena,
    compararContrasena,
} from "../../utils/contrasena.util";
import {
    generarToken,
    generarTokenActualizacion,
    verificarTokenActualizacion,
} from "../../utils/jwt.util";
import { ErrorAplicacion } from "../../middlewares/errores.middleware";
import { EntradaInicioSesion, EntradaRegistro } from "./autenticacion.esquema";

export class ServicioAutenticacion {
    async iniciarSesion(datos: EntradaInicioSesion) {
        const usuario = await prisma.usuario.findUnique({
            where: { correo: datos.correo },
        });

        if (!usuario || !usuario.estaActivo) {
            throw new ErrorAplicacion(401, "Credenciales inválidas");
        }

        const esContrasenaValida = await compararContrasena(
            datos.contrasena,
            usuario.contrasena
        );

        if (!esContrasenaValida) {
            throw new ErrorAplicacion(401, "Credenciales inválidas");
        }

        const token = generarToken({
            usuarioId: usuario.id,
            correo: usuario.correo,
            rol: usuario.rol,
        });

        const tokenActualizacion = generarTokenActualizacion({
            usuarioId: usuario.id,
            correo: usuario.correo,
            rol: usuario.rol,
        });

        const { contrasena: _, ...usuarioSinContrasena } = usuario;

        return {
            usuario: usuarioSinContrasena,
            token,
            tokenActualizacion,
        };
    }

    async registrar(datos: EntradaRegistro) {
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { correo: datos.correo },
        });

        if (usuarioExistente) {
            throw new ErrorAplicacion(
                409,
                "El correo electrónico ya está registrado"
            );
        }

        const contrasenaEncriptada = await encriptarContrasena(
            datos.contrasena
        );

        const usuario = await prisma.usuario.create({
            data: {
                ...datos,
                contrasena: contrasenaEncriptada,
                rol: datos.rol || "SECRETARIA",
            },
        });

        const { contrasena: _, ...usuarioSinContrasena } = usuario;

        return usuarioSinContrasena;
    }

    async actualizarToken(tokenActualizacion: string) {
        try {
            const decodificado =
                verificarTokenActualizacion(tokenActualizacion);

            const usuario = await prisma.usuario.findUnique({
                where: { id: decodificado.usuarioId },
            });

            if (!usuario || !usuario.estaActivo) {
                throw new ErrorAplicacion(
                    401,
                    "Usuario no encontrado o inactivo"
                );
            }

            const nuevoToken = generarToken({
                usuarioId: usuario.id,
                correo: usuario.correo,
                rol: usuario.rol,
            });

            const nuevoTokenActualizacion = generarTokenActualizacion({
                usuarioId: usuario.id,
                correo: usuario.correo,
                rol: usuario.rol,
            });

            return {
                token: nuevoToken,
                tokenActualizacion: nuevoTokenActualizacion,
            };
        } catch (error) {
            throw new ErrorAplicacion(401, "Token de actualización inválido");
        }
    }

    async obtenerPerfil(usuarioId: string) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: {
                id: true,
                correo: true,
                nombres: true,
                apellidos: true,
                rol: true,
                estaActivo: true,
                creadoEn: true,
            },
        });

        if (!usuario) {
            throw new ErrorAplicacion(404, "Usuario no encontrado");
        }

        return usuario;
    }
}
