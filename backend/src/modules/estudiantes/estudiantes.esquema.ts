import { z } from 'zod';
import { Genero } from '@prisma/client';

const params = {
  id: z.string().uuid({
    message: 'El ID del estudiante debe ser un UUID válido.',
  }),
};

export const crearEstudianteEsquema = z.object({
  body: z.object({
    nombres: z.string().min(2).max(50),
    apellidos: z.string().min(2).max(50),
    dni: z.string().length(8, 'El DNI debe tener 8 caracteres.'),
    fechaNacimiento: z.string().datetime('La fecha de nacimiento debe ser una fecha válida.'),
    genero: z.nativeEnum(Genero),
    direccion: z.string().min(5),
    telefono: z.string().min(7).max(15).optional(),
    apoderadoId: z.string().uuid('El ID del apoderado debe ser un UUID válido.'),
    urlFoto: z.string().url('La URL de la foto no es válida.').optional(),
  }),
});

export const actualizarEstudianteEsquema = z.object({
  params: z.object(params),
  body: crearEstudianteEsquema.shape.body.partial(), // Todos los campos son opcionales
});

export const obtenerEstudianteEsquema = z.object({
  params: z.object(params),
});

export const listarEstudiantesEsquema = z.object({
  query: z.object({
    pagina: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limite: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
    filtro: z.string().optional(),
  }),
});

export const cambiarEstadoEstudianteEsquema = z.object({
  params: z.object(params),
  body: z.object({
    estaActivo: z.boolean(),
  }),
});

export type CrearEstudianteBody = z.infer<typeof crearEstudianteEsquema>['body'];
export type ActualizarEstudianteParams = z.infer<typeof actualizarEstudianteEsquema>['params'];
export type ActualizarEstudianteBody = z.infer<typeof actualizarEstudianteEsquema>['body'];
export type ObtenerEstudianteParams = z.infer<typeof obtenerEstudianteEsquema>['params'];
export type ListarEstudiantesQuery = z.infer<typeof listarEstudiantesEsquema>['query'];
export type CambiarEstadoEstudianteParams = z.infer<
  typeof cambiarEstadoEstudianteEsquema
>['params'];
export type CambiarEstadoEstudianteBody = z.infer<
  typeof cambiarEstadoEstudianteEsquema
>['body'];
