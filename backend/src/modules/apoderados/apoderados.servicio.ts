import { Prisma } from '@prisma/client';
import { prisma } from '../../config/baseDatos';
import { ErrorAplicacion } from '../../middlewares/errores.middleware';
import { CrearApoderadoBody } from './apoderados.esquema';

export const crearApoderado = async (datos: CrearApoderadoBody) => {
  // 1. Verificar que el DNI no esté ya registrado
  const dniExistente = await prisma.apoderado.findUnique({
    where: { dni: datos.dni },
  });
  if (dniExistente) {
    throw new ErrorAplicacion(409, 'El DNI del apoderado ya está registrado.');
  }

  // 2. Crear el apoderado
  return prisma.apoderado.create({ data: datos });
};

export const listarApoderados = async (
  pagina: number,
  limite: number,
  filtro?: string,
) => {
  const skip = (pagina - 1) * limite;
  const where: Prisma.ApoderadoWhereInput = filtro
    ? {
        OR: [
          { nombres: { contains: filtro, mode: 'insensitive' } },
          { apellidos: { contains: filtro, mode: 'insensitive' } },
          { dni: { contains: filtro } },
        ],
      }
    : {};

  const [apoderados, total] = await prisma.$transaction([
    prisma.apoderado.findMany({
      where,
      skip,
      take: limite,
      orderBy: { apellidos: 'asc' },
    }),
    prisma.apoderado.count({ where }),
  ]);

  return { apoderados, total };
};

export const obtenerApoderadoPorId = async (id: string) => {
  const apoderado = await prisma.apoderado.findUnique({
    where: { id },
    include: {
      estudiantes: {
        select: {
          id: true,
          nombres: true,
          apellidos: true,
          estaActivo: true,
        },
      },
    },
  });

  if (!apoderado) {
    throw new ErrorAplicacion(404, 'Apoderado no encontrado.');
  }

  return apoderado;
};

export const actualizarApoderado = async (id: string, datos: Prisma.ApoderadoUpdateInput) => {
  // 1. Verificar que el apoderado exista
  const apoderadoExistente = await prisma.apoderado.findUnique({ where: { id } });
  if (!apoderadoExistente) {
    throw new ErrorAplicacion(404, 'Apoderado no encontrado.');
  }

  // 2. Si se está cambiando el DNI, verificar que no exista en otro apoderado
  if (datos.dni && typeof datos.dni === 'string' && datos.dni !== apoderadoExistente.dni) {
    const dniExistente = await prisma.apoderado.findUnique({
      where: { dni: datos.dni },
    });
    if (dniExistente) {
      throw new ErrorAplicacion(409, 'El nuevo DNI ya está registrado en otro apoderado.');
    }
  }

  // 3. Actualizar apoderado
  return prisma.apoderado.update({
    where: { id },
    data: datos,
  });
};
