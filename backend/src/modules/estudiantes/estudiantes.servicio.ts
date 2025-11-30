import { Prisma } from '@prisma/client';
import { prisma } from '../../config/baseDatos';
import { ErrorAplicacion } from '../../middlewares/errores.middleware';
import { CrearEstudianteBody } from './estudiantes.esquema';

export const crearEstudiante = async (datos: CrearEstudianteBody) => {
  // 1. Verificar que el DNI no esté ya registrado
  const dniExistente = await prisma.estudiante.findUnique({
    where: { dni: datos.dni },
  });
  if (dniExistente) {
    throw new ErrorAplicacion(409, 'El DNI del estudiante ya está registrado.');
  }

  // 2. Verificar que el apoderado exista
  const apoderadoExistente = await prisma.apoderado.findUnique({
    where: { id: datos.apoderadoId },
  });
  if (!apoderadoExistente) {
    throw new ErrorAplicacion(404, 'El apoderado especificado no existe.');
  }

  // 3. Crear el estudiante
  return prisma.estudiante.create({
    data: {
      ...datos,
      fechaNacimiento: new Date(datos.fechaNacimiento),
    },
  });
};

export const listarEstudiantes = async (
  pagina: number,
  limite: number,
  filtro?: string,
) => {
  const skip = (pagina - 1) * limite;
  const where: Prisma.EstudianteWhereInput = filtro
    ? {
        OR: [
          { nombres: { contains: filtro, mode: 'insensitive' } },
          { apellidos: { contains: filtro, mode: 'insensitive' } },
          { dni: { contains: filtro } },
        ],
      }
    : {};

  const [estudiantes, total] = await prisma.$transaction([
    prisma.estudiante.findMany({
      where,
      skip,
      take: limite,
      orderBy: { apellidos: 'asc' },
      include: {
        apoderado: {
          select: {
            nombres: true,
            apellidos: true,
          },
        },
      },
    }),
    prisma.estudiante.count({ where }),
  ]);

  return { estudiantes, total };
};

export const obtenerEstudiantePorId = async (id: string) => {
  const estudiante = await prisma.estudiante.findUnique({
    where: { id },
    include: {
      apoderado: true, // Incluir todos los datos del apoderado
      documentos: true, // Incluir documentos relacionados
    },
  });

  if (!estudiante) {
    throw new ErrorAplicacion(404, 'Estudiante no encontrado.');
  }

  return estudiante;
};

export const actualizarEstudiante = async (
  id: string,
  datos: Prisma.EstudianteUpdateInput,
) => {
  // 1. Verificar que el estudiante exista
  const estudianteExistente = await prisma.estudiante.findUnique({ where: { id } });
  if (!estudianteExistente) {
    throw new ErrorAplicacion(404, 'Estudiante no encontrado.');
  }

  // 2. Si se está cambiando el DNI, verificar que no exista en otro estudiante
  if (datos.dni && typeof datos.dni === 'string' && datos.dni !== estudianteExistente.dni) {
    const dniExistente = await prisma.estudiante.findUnique({
      where: { dni: datos.dni },
    });
    if (dniExistente) {
      throw new ErrorAplicacion(409, 'El nuevo DNI ya está registrado en otro estudiante.');
    }
  }

  // 3. Si se está cambiando el apoderado, verificar que exista
  if (datos.apoderadoId && typeof datos.apoderadoId === 'string') {
    const apoderadoExistente = await prisma.apoderado.findUnique({
      where: { id: datos.apoderadoId },
    });
    if (!apoderadoExistente) {
      throw new ErrorAplicacion(404, 'El nuevo apoderado especificado no existe.');
    }
  }

  // 4. Actualizar estudiante
  return prisma.estudiante.update({
    where: { id },
    data: datos,
  });
};

export const cambiarEstadoEstudiante = async (id: string, estaActivo: boolean) => {
  // 1. Verificar que el estudiante exista
  const estudianteExistente = await prisma.estudiante.findUnique({ where: { id } });
  if (!estudianteExistente) {
    throw new ErrorAplicacion(404, 'Estudiante no encontrado.');
  }

  // 2. Actualizar estado
  return prisma.estudiante.update({
    where: { id },
    data: { estaActivo },
  });
};
