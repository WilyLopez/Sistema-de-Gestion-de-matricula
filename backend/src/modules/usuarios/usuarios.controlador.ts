import { Request, Response } from 'express';
import * as servicio from './usuarios.servicio';
import { respuestaExitosa } from '../../utils/respuesta.util';
import {
  ActualizarUsuarioBody,
  ActualizarUsuarioParams,
  CambiarEstadoUsuarioBody,
  CambiarEstadoUsuarioParams,
  ObtenerUsuarioParams,
} from './usuarios.esquema';
import { manejadorAsincrono } from '../../middlewares/errores.middleware';

export const obtenerUsuarios = manejadorAsincrono(async (req: Request, res: Response) => {
  const usuarios = await servicio.listarUsuarios();
  respuestaExitosa(res, usuarios, 'Lista de usuarios obtenida con éxito.');
});

export const obtenerUsuario = manejadorAsincrono(async (
  req: Request<ObtenerUsuarioParams>,
  res: Response,
) => {
  const { id } = req.params;
  const usuario = await servicio.obtenerUsuarioPorId(id);
  respuestaExitosa(res, usuario, 'Usuario obtenido con éxito.');
});

export const actualizarUsuario = manejadorAsincrono(async (
  req: Request<ActualizarUsuarioParams, any, ActualizarUsuarioBody>,
  res: Response,
) => {
  const { id } = req.params;
  const datos = req.body;
  const usuarioActualizado = await servicio.actualizarUsuario(id, datos);
  respuestaExitosa(res, usuarioActualizado, 'Usuario actualizado con éxito.');
});

export const cambiarEstadoUsuario = manejadorAsincrono(async (
  req: Request<CambiarEstadoUsuarioParams, any, CambiarEstadoUsuarioBody>,
  res: Response,
) => {
  const { id } = req.params;
  const { estaActivo } = req.body;
  const usuario = await servicio.cambiarEstadoUsuario(id, estaActivo);
  const mensaje = `Usuario ${estaActivo ? 'habilitado' : 'deshabilitado'} con éxito.`;
  respuestaExitosa(res, usuario, mensaje);
});
