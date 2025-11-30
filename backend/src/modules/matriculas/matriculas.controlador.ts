import { Request, Response } from 'express';
import * as servicio from './matriculas.servicio';
import { respuestaExitosa, respuestaPaginada } from '../../utils/respuesta.util';
import { manejadorAsincrono } from '../../middlewares/errores.middleware';
import { SolicitudAutenticada } from '../../middlewares/autenticacion.middleware';

export const crearMatricula = manejadorAsincrono(async (req: SolicitudAutenticada, res: Response) => {
  const creadoPorId = req.usuario.id;
  const matricula = await servicio.crearMatricula(req.body, creadoPorId);
  respuestaExitosa(res, matricula, 'Matrícula creada con éxito.', 201);
});

export const listarMatriculas = manejadorAsincrono(async (req: Request, res: Response) => {
  const { matriculas, total } = await servicio.listarMatriculas(req.query as any);
  respuestaPaginada(
    res,
    matriculas,
    Number(req.query.pagina) || 1,
    Number(req.query.limite) || 10,
    total,
    'Lista de matrículas obtenida con éxito.',
  );
});

export const obtenerMatricula = manejadorAsincrono(async (req: Request, res: Response) => {
  const { id } = req.params;
  const matricula = await servicio.obtenerMatriculaPorId(id);
  respuestaExitosa(res, matricula, 'Matrícula obtenida con éxito.');
});

export const actualizarEstadoMatricula = manejadorAsincrono(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { estado } = req.body;
    const matricula = await servicio.actualizarEstadoMatricula(id, estado);
    respuestaExitosa(res, matricula, 'Estado de la matrícula actualizado con éxito.');
  },
);

export const registrarPago = manejadorAsincrono(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fechaPago } = req.body;
  const matricula = await servicio.registrarPago(id, fechaPago);
  respuestaExitosa(res, matricula, 'Pago registrado con éxito.');
});
