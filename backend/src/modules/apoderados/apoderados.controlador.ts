import { Request, Response } from 'express';
import * as servicio from './apoderados.servicio';
import { respuestaExitosa, respuestaPaginada } from '../../utils/respuesta.util';
import { manejadorAsincrono } from '../../middlewares/errores.middleware';
import {
  ActualizarApoderadoBody,
  ActualizarApoderadoParams,
  CrearApoderadoBody,
  ListarApoderadosQuery,
  ObtenerApoderadoParams,
} from './apoderados.esquema';

export const crearApoderado = manejadorAsincrono(
  async (req: Request<any, any, CrearApoderadoBody>, res: Response) => {
    const apoderado = await servicio.crearApoderado(req.body);
    respuestaExitosa(res, apoderado, 'Apoderado creado con éxito.', 201);
  },
);

export const listarApoderados = manejadorAsincrono(
  async (req: Request<any, any, any, ListarApoderadosQuery>, res: Response) => {
    const { pagina, limite, filtro } = req.query;
    const { apoderados, total } = await servicio.listarApoderados(pagina, limite, filtro);
    respuestaPaginada(
      res,
      apoderados,
      pagina,
      limite,
      total,
      'Lista de apoderados obtenida con éxito.',
    );
  },
);

export const obtenerApoderado = manejadorAsincrono(
  async (req: Request<ObtenerApoderadoParams>, res: Response) => {
    const apoderado = await servicio.obtenerApoderadoPorId(req.params.id);
    respuestaExitosa(res, apoderado, 'Apoderado obtenido con éxito.');
  },
);

export const actualizarApoderado = manejadorAsincrono(
  async (req: Request<ActualizarApoderadoParams, any, ActualizarApoderadoBody>, res: Response) => {
    const apoderado = await servicio.actualizarApoderado(req.params.id, req.body);
    respuestaExitosa(res, apoderado, 'Apoderado actualizado con éxito.');
  },
);
