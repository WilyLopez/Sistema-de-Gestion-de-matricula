import { z } from 'zod';

const params = {
  id: z.string().uuid({
    message: 'El ID del apoderado debe ser un UUID válido.',
  }),
};

export const crearApoderadoEsquema = z.object({
  body: z.object({
    nombres: z.string().min(2).max(50),
    apellidos: z.string().min(2).max(50),
    dni: z.string().length(8, 'El DNI debe tener 8 caracteres.'),
    parentesco: z.string().min(3).max(20),
    telefono: z.string().min(7).max(15),
    correo: z.string().email('El correo no es válido.').optional(),
    direccion: z.string().min(5),
    ocupacion: z.string().min(3).optional(),
  }),
});

export const actualizarApoderadoEsquema = z.object({
  params: z.object(params),
  body: crearApoderadoEsquema.shape.body.partial(), // Todos los campos son opcionales
});

export const obtenerApoderadoEsquema = z.object({
  params: z.object(params),
});

export const listarApoderadosEsquema = z.object({
  query: z.object({
    pagina: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limite: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
    filtro: z.string().optional(),
  }),
});

export type CrearApoderadoBody = z.infer<typeof crearApoderadoEsquema>['body'];
export type ActualizarApoderadoParams = z.infer<typeof actualizarApoderadoEsquema>['params'];
export type ActualizarApoderadoBody = z.infer<typeof actualizarApoderadoEsquema>['body'];
export type ObtenerApoderadoParams = z.infer<typeof obtenerApoderadoEsquema>['params'];
export type ListarApoderadosQuery = z.infer<typeof listarApoderadosEsquema>['query'];
