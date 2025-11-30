import { z } from 'zod';
import { TipoMatricula, EstadoMatricula } from '@prisma/client';

const params = {
  id: z.string().uuid({
    message: 'El ID de la matrícula debe ser un UUID válido.',
  }),
};

export const crearMatriculaEsquema = z.object({
  body: z.object({
    estudianteId: z.string().uuid(),
    seccionId: z.string().uuid(),
    tipoMatricula: z.nativeEnum(TipoMatricula),
    observaciones: z.string().optional(),
  }),
});

export const actualizarEstadoMatriculaEsquema = z.object({
  params: z.object(params),
  body: z.object({
    estado: z.enum([EstadoMatricula.CONFIRMADA, EstadoMatricula.CANCELADA]),
    observaciones: z.string().optional(),
  }),
});

export const registrarPagoEsquema = z.object({
  params: z.object(params),
  body: z.object({
    fechaPago: z.string().datetime().optional(),
  }),
});

export const obtenerMatriculaEsquema = z.object({
  params: z.object(params),
});

export const listarMatriculasEsquema = z.object({
  query: z.object({
    pagina: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limite: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
    anioAcademicoId: z.string().uuid().optional(),
    estado: z.nativeEnum(EstadoMatricula).optional(),
    estaPagado: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    filtro: z.string().optional(), // Para buscar por código o nombre de estudiante
  }),
});
