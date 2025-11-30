import { Request, Response } from "express";
import { ServicioAutenticacion } from "./autenticacion.servicio";
import { respuestaExitosa } from "../../utils/respuesta.util";
import { manejadorAsincrono } from "../../middlewares/errores.middleware";
import { SolicitudAutenticada } from "../../middlewares/autenticacion.middleware";

const servicioAutenticacion = new ServicioAutenticacion();

export const iniciarSesion = manejadorAsincrono(
    async (req: Request, res: Response) => {
        const resultado = await servicioAutenticacion.iniciarSesion(req.body);
        respuestaExitosa(res, resultado, "Inicio de sesión exitoso");
    }
);

export const registrar = manejadorAsincrono(
    async (req: Request, res: Response) => {
        const usuario = await servicioAutenticacion.registrar(req.body);
        respuestaExitosa(res, usuario, "Usuario registrado exitosamente", 201);
    }
);

export const actualizarToken = manejadorAsincrono(
    async (req: Request, res: Response) => {
        const { tokenActualizacion } = req.body;
        const tokens = await servicioAutenticacion.actualizarToken(
            tokenActualizacion
        );
        respuestaExitosa(res, tokens, "Token actualizado");
    }
);

export const obtenerPerfil = manejadorAsincrono(
    async (req: SolicitudAutenticada, res: Response) => {
        const usuario = await servicioAutenticacion.obtenerPerfil(
            req.usuario!.id
        );
        respuestaExitosa(res, usuario);
    }
);
