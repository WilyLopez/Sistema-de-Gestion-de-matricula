import { Request, Response } from 'express';
import * as servicio from './estudiantes.servicio';
import { respuestaExitosa, respuestaPaginada } from '../../utils/respuesta.util';
import { manejadorAsincrono } from '../../middlewares/errores.middleware';
import {
  ActualizarEstudianteBody,
  ActualizarEstudianteParams,
  CambiarEstadoEstudianteBody,
  CambiarEstadoEstudianteParams,
  CrearEstudianteBody,
  ListarEstudiantesQuery,
  ObtenerEstudianteParams,
} from './estudiantes.esquema';

export const crearEstudiante = manejadorAsincrono(
  async (req: Request<any, any, CrearEstudianteBody>, res: Response) => {
    const estudiante = await servicio.crearEstudiante(req.body);
    respuestaExitosa(res, estudiante, 'Estudiante creado con éxito.', 201);
  },
);

export const listarEstudiantes = manejadorAsincrono(
  async (req: Request<any, any, any, ListarEstudiantesQuery>, res: Response) => {
    const { pagina, limite, filtro } = req.query;
    const { estudiantes, total } = await servicio.listarEstudiantes(pagina, limite, filtro);
    respuestaPaginada(
      res,
      estudiantes,
      pagina,
      limite,
      total,
      'Lista de estudiantes obtenida con éxito.',
    );
  },
);

export const obtenerEstudiante = manejadorAsincrono(
  async (req: Request<ObtenerEstudianteParams>, res: Response) => {
    const estudiante = await servicio.obtenerEstudiantePorId(req.params.id);
    respuestaExitosa(res, estudiante, 'Estudiante obtenido con éxito.');
  },
);

export const actualizarEstudiante = manejadorAsincrono(
  async (req: Request<ActualizarEstudianteParams, any, ActualizarEstudianteBody>, res: Response) => {
    const estudiante = await servicio.actualizarEstudiante(req.params.id, req.body);
    respuestaExitosa(res, estudiante, 'Estudiante actualizado con éxito.');
  },
);

export const cambiarEstadoEstudiante = manejadorAsincrono(
  async (
    req: Request<CambiarEstadoEstudianteParams, any, CambiarEstadoEstudianteBody>,
    res: Response,
  ) => {
    const { id } = req.params;
    const { estaActivo } = req.body;
    const estudiante = await servicio.cambiarEstadoEstudiante(id, estaActivo);
    const mensaje = `Estudiante ${estaActivo ? 'habilitado' : 'deshabilitado'} con éxito.`;
    respuestaExitosa(res, estudiante, mensaje);
  },
);
