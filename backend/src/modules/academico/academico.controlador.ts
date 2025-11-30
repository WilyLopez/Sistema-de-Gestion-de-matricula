import { Request, Response } from 'express';
import * as servicio from './academico.servicio';
import { respuestaExitosa } from '../../utils/respuesta.util';
import { manejadorAsincrono } from '../../middlewares/errores.middleware';
import { Prisma } from '@prisma/client';

// ========== Controladores para Año Académico ==========

export const crearAnioAcademico = manejadorAsincrono(async (req: Request, res: Response) => {
  const datos: Prisma.AnioAcademicoCreateInput = {
    ...req.body,
    fechaInicio: new Date(req.body.fechaInicio),
    fechaFin: new Date(req.body.fechaFin),
  };
  const anio = await servicio.crearAnioAcademico(datos);
  respuestaExitosa(res, anio, 'Año académico creado con éxito.', 201);
});

export const listarAniosAcademicos = manejadorAsincrono(async (req: Request, res: Response) => {
  const anios = await servicio.listarAniosAcademicos();
  respuestaExitosa(res, anios, 'Años académicos obtenidos con éxito.');
});

export const obtenerAnioAcademico = manejadorAsincrono(async (req: Request, res: Response) => {
  const { anioId } = req.params;
  const anio = await servicio.obtenerAnioAcademicoPorId(anioId);
  respuestaExitosa(res, anio, 'Año académico obtenido con éxito.');
});

export const actualizarAnioAcademico = manejadorAsincrono(async (req: Request, res: Response) => {
  const { anioId } = req.params;
  const anio = await servicio.actualizarAnioAcademico(anioId, req.body);
  respuestaExitosa(res, anio, 'Año académico actualizado con éxito.');
});


// ========== Controladores para Grado ==========

export const crearGrado = manejadorAsincrono(async (req: Request, res: Response) => {
  const { anioAcademicoId, ...resto } = req.body;
  const datos: Prisma.GradoCreateInput = {
    ...resto,
    anioAcademico: { connect: { id: anioAcademicoId } },
  };
  const grado = await servicio.crearGrado(datos);
  respuestaExitosa(res, grado, 'Grado creado con éxito.', 201);
});

export const listarGradosPorAnio = manejadorAsincrono(async (req: Request, res: Response) => {
  const { anioId } = req.params;
  const grados = await servicio.listarGradosPorAnio(anioId);
  respuestaExitosa(res, grados, 'Grados obtenidos con éxito.');
});

export const obtenerGrado = manejadorAsincrono(async (req: Request, res: Response) => {
  const { gradoId } = req.params;
  const grado = await servicio.obtenerGradoPorId(gradoId);
  respuestaExitosa(res, grado, 'Grado obtenido con éxito.');
});

export const actualizarGrado = manejadorAsincrono(async (req: Request, res: Response) => {
  const { gradoId } = req.params;
  const grado = await servicio.actualizarGrado(gradoId, req.body);
  respuestaExitosa(res, grado, 'Grado actualizado con éxito.');
});


// ========== Controladores para Sección ==========

export const crearSeccion = manejadorAsincrono(async (req: Request, res: Response) => {
    const { gradoId, ...resto } = req.body;
    const datos: Prisma.SeccionCreateInput = {
      ...resto,
      grado: { connect: { id: gradoId } },
    };
  const seccion = await servicio.crearSeccion(datos);
  respuestaExitosa(res, seccion, 'Sección creada con éxito.', 201);
});

export const listarSeccionesPorGrado = manejadorAsincrono(async (req: Request, res: Response) => {
  const { gradoId } = req.params;
  const secciones = await servicio.listarSeccionesPorGrado(gradoId);
  respuestaExitosa(res, secciones, 'Secciones obtenidas con éxito.');
});

export const obtenerSeccion = manejadorAsincrono(async (req: Request, res: Response) => {
  const { seccionId } = req.params;
  const seccion = await servicio.obtenerSeccionPorId(seccionId);
  respuestaExitosa(res, seccion, 'Sección obtenida con éxito.');
});

export const actualizarSeccion = manejadorAsincrono(async (req: Request, res: Response) => {
  const { seccionId } = req.params;
  const seccion = await servicio.actualizarSeccion(seccionId, req.body);
  respuestaExitosa(res, seccion, 'Sección actualizada con éxito.');
});
