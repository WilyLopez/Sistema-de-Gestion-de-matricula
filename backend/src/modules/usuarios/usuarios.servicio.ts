import { Prisma, Usuario } from '@prisma/client';
import { prisma } from '../../config/baseDatos';
import { ErrorAplicacion } from '../../middlewares/errores.middleware';

// Excluimos el campo 'contrasena' de las consultas de usuario
const selectorUsuario = {
  id: true,
  correo: true,
  nombres: true,
  apellidos: true,
  rol: true,
  estaActivo: true,
  creadoEn: true,
  actualizadoEn: true,
};

export const listarUsuarios = async (): Promise<Partial<Usuario>[]> => {
  return prisma.usuario.findMany({
    select: selectorUsuario,
    orderBy: {
      creadoEn: 'desc',
    },
  });
};

export const obtenerUsuarioPorId = async (id: string): Promise<Partial<Usuario> | null> => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: selectorUsuario,
  });

  if (!usuario) {
    throw new ErrorAplicacion(404, 'Usuario no encontrado.');
  }

  return usuario;
};

export const actualizarUsuario = async (
  id: string,
  datos: Prisma.UsuarioUpdateInput,
): Promise<Partial<Usuario>> => {
  // Verificamos si el usuario existe antes de intentar actualizarlo
  const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });
  if (!usuarioExistente) {
    throw new ErrorAplicacion(404, 'Usuario no encontrado.');
  }

  return prisma.usuario.update({
    where: { id },
    data: datos,
    select: selectorUsuario,
  });
};

export const cambiarEstadoUsuario = async (
  id: string,
  estaActivo: boolean,
): Promise<Partial<Usuario>> => {
  // Verificamos si el usuario existe antes de intentar actualizarlo
  const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });
  if (!usuarioExistente) {
    throw new ErrorAplicacion(404, 'Usuario no encontrado.');
  }

  return prisma.usuario.update({
    where: { id },
    data: { estaActivo },
    select: selectorUsuario,
  });
};
