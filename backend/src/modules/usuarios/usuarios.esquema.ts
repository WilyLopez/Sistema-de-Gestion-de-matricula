import { z } from 'zod';
import { RolUsuario } from '@prisma/client';

const params = {
  id: z.string().uuid({
    message: 'El ID del usuario debe ser un UUID válido.',
  }),
};

export const obtenerUsuarioEsquema = z.object({
  params: z.object(params),
});

export const actualizarUsuarioEsquema = z.object({
  params: z.object(params),
  body: z
    .object({
      nombres: z.string().min(2, 'Los nombres deben tener al menos 2 caracteres.').max(50),
      apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres.').max(50),
      rol: z.nativeEnum(RolUsuario, {
        errorMap: () => ({ message: 'El rol proporcionado no es válido.' }),
      }),
    })
    .partial(), // Hace todos los campos opcionales
});

export const cambiarEstadoUsuarioEsquema = z.object({
  params: z.object(params),
  body: z.object({
    estaActivo: z.boolean({
      required_error: 'El campo estaActivo es obligatorio.',
      invalid_type_error: 'El campo estaActivo debe ser un valor booleano.',
    }),
  }),
});

export type ObtenerUsuarioParams = z.infer<typeof obtenerUsuarioEsquema>['params'];
export type ActualizarUsuarioParams = z.infer<typeof actualizarUsuarioEsquema>['params'];
export type ActualizarUsuarioBody = z.infer<typeof actualizarUsuarioEsquema>['body'];
export type CambiarEstadoUsuarioParams = z.infer<typeof cambiarEstadoUsuarioEsquema>['params'];
export type CambiarEstadoUsuarioBody = z.infer<typeof cambiarEstadoUsuarioEsquema>['body'];
