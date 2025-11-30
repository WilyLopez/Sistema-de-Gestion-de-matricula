import { z } from 'zod';
import { NivelEducativo } from '@prisma/client';

// ========== Esquemas de Parámetros ==========
export const anioIdEsquema = z.object({
  params: z.object({
    anioId: z.string().uuid({ message: 'El ID del año académico debe ser un UUID válido.' }),
  }),
});

export const gradoIdEsquema = z.object({
  params: z.object({
    gradoId: z.string().uuid({ message: 'El ID del grado debe ser un UUID válido.' }),
  }),
});

export const seccionIdEsquema = z.object({
  params: z.object({
    seccionId: z.string().uuid({ message: 'El ID de la sección debe ser un UUID válido.' }),
  }),
});

// ========== Esquemas de Año Académico ==========
export const crearAnioAcademicoEsquema = z.object({
  body: z.object({
    anio: z.number().int().min(2020).max(2100),
    fechaInicio: z.string().datetime(),
    fechaFin: z.string().datetime(),
  }),
});

export const actualizarAnioAcademicoEsquema = z.object({
  params: anioIdEsquema.shape.params,
  body: crearAnioAcademicoEsquema.shape.body.partial().extend({
    esActual: z.boolean().optional(),
    estaActivo: z.boolean().optional(),
  }),
});

// ========== Esquemas de Grado ==========
export const crearGradoEsquema = z.object({
  body: z.object({
    anioAcademicoId: z.string().uuid(),
    nivel: z.nativeEnum(NivelEducativo),
    numeroGrado: z.number().int().min(1).max(6),
    costoMatricula: z.number().positive(),
    costoMensual: z.number().positive(),
  }),
});

export const actualizarGradoEsquema = z.object({
  params: gradoIdEsquema.shape.params,
  body: crearGradoEsquema.shape.body.omit({ anioAcademicoId: true }).partial().extend({
    estaActivo: z.boolean().optional(),
  }),
});

// ========== Esquemas de Sección ==========
export const crearSeccionEsquema = z.object({
  body: z.object({
    gradoId: z.string().uuid(),
    nombre: z.string().min(1).max(10), // "A", "B", "Unica"
    capacidadMaxima: z.number().int().positive(),
  }),
});

export const actualizarSeccionEsquema = z.object({
  params: seccionIdEsquema.shape.params,
  body: crearSeccionEsquema.shape.body.omit({ gradoId: true }).partial().extend({
    estaActivo: z.boolean().optional(),
  }),
});
