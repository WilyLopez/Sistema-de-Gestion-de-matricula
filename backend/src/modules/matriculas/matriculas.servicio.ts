import { Prisma, EstadoMatricula } from '@prisma/client';
import { prisma } from '../../config/baseDatos';
import { ErrorAplicacion } from '../../middlewares/errores.middleware';
import { ListarMatriculasEsquema } from './matriculas.esquema';

type CrearMatriculaInput = {
  estudianteId: string;
  seccionId: string;
  tipoMatricula: 'NUEVA' | 'RENOVACION';
  observaciones?: string;
};

// Generador de código de matrícula: MAT-YYYY-XXXX
const generarCodigoMatricula = async (anio: number): Promise<string> => {
  const prefijo = `MAT-${anio}-`;
  const ultimaMatricula = await prisma.matricula.findFirst({
    where: { codigo: { startsWith: prefijo } },
    orderBy: { codigo: 'desc' },
  });

  let correlativo = 1;
  if (ultimaMatricula) {
    correlativo = parseInt(ultimaMatricula.codigo.split('-')[2]) + 1;
  }

  return `${prefijo}${correlativo.toString().padStart(4, '0')}`;
};

export const crearMatricula = async (datos: CrearMatriculaInput, creadoPorId: string) => {
  return prisma.$transaction(async (tx) => {
    // 1. Obtener información de la sección y grado
    const seccion = await tx.seccion.findUnique({
      where: { id: datos.seccionId },
      include: { grado: { include: { anioAcademico: true } } },
    });

    if (!seccion) {
      throw new ErrorAplicacion(404, 'La sección especificada no existe.');
    }
    if (!seccion.estaActivo || !seccion.grado.estaActivo || !seccion.grado.anioAcademico.estaActivo) {
        throw new ErrorAplicacion(400, 'La sección, grado o año académico no están activos.');
    }

    const { grado } = seccion;
    const { anioAcademico } = grado;

    // 2. Verificar si el estudiante ya está matriculado en este año académico
    const matriculaExistente = await tx.matricula.findFirst({
      where: {
        estudianteId: datos.estudianteId,
        anioAcademicoId: anioAcademico.id,
      },
    });
    if (matriculaExistente) {
      throw new ErrorAplicacion(409, 'El estudiante ya tiene una matrícula para este año académico.');
    }

    // 3. Verificar capacidad de la sección
    if (seccion.capacidadActual >= seccion.capacidadMaxima) {
      throw new ErrorAplicacion(409, 'La sección ha alcanzado su capacidad máxima.');
    }

    // 4. Generar código de matrícula
    const codigo = await generarCodigoMatricula(anioAcademico.anio);

    // 5. Crear la matrícula
    const nuevaMatricula = await tx.matricula.create({
      data: {
        codigo,
        estudiante: { connect: { id: datos.estudianteId } },
        anioAcademico: { connect: { id: anioAcademico.id } },
        seccion: { connect: { id: datos.seccionId } },
        tipoMatricula: datos.tipoMatricula,
        estado: 'PENDIENTE',
        costoTotal: grado.costoMatricula,
        creadoPor: { connect: { id: creadoPorId } },
        observaciones: datos.observaciones,
      },
    });

    // 6. Actualizar la capacidad de la sección
    await tx.seccion.update({
      where: { id: datos.seccionId },
      data: { capacidadActual: { increment: 1 } },
    });

    return nuevaMatricula;
  });
};

export const listarMatriculas = async (query: z.infer<typeof listarMatriculasEsquema>['query']) => {
  const { pagina, limite, anioAcademicoId, estado, estaPagado, filtro } = query;
  const skip = (pagina - 1) * limite;

  const where: Prisma.MatriculaWhereInput = {
    anioAcademicoId,
    estado,
    estaPagado,
    OR: filtro
      ? [
          { codigo: { contains: filtro, mode: 'insensitive' } },
          { estudiante: { nombres: { contains: filtro, mode: 'insensitive' } } },
          { estudiante: { apellidos: { contains: filtro, mode: 'insensitive' } } },
        ]
      : undefined,
  };

  const [matriculas, total] = await prisma.$transaction([
    prisma.matricula.findMany({
      where,
      skip,
      take: limite,
      orderBy: { fechaMatricula: 'desc' },
      include: {
        estudiante: { select: { id: true, nombres: true, apellidos: true } },
        seccion: { select: { nombre: true, grado: { select: { numeroGrado: true, nivel: true } } } },
      },
    }),
    prisma.matricula.count({ where }),
  ]);

  return { matriculas, total };
};

export const obtenerMatriculaPorId = async (id: string) => {
  const matricula = await prisma.matricula.findUnique({
    where: { id },
    include: {
      estudiante: { include: { apoderado: true } },
      anioAcademico: true,
      seccion: { include: { grado: true } },
      creadoPor: { select: { id: true, nombres: true, apellidos: true } },
    },
  });

  if (!matricula) {
    throw new ErrorAplicacion(404, 'Matrícula no encontrada.');
  }
  return matricula;
};

export const actualizarEstadoMatricula = async (id: string, estado: EstadoMatricula) => {
    return prisma.$transaction(async (tx) => {
        const matricula = await tx.matricula.findUnique({ where: { id } });
        if (!matricula) {
          throw new ErrorAplicacion(404, 'Matrícula no encontrada.');
        }
        if (matricula.estado === estado) {
            return matricula; // No hay cambios que hacer
        }
        if (matricula.estado === 'CANCELADA' && estado === 'CONFIRMADA') {
            throw new ErrorAplicacion(400, 'No se puede confirmar una matrícula ya cancelada.');
        }

        // Si se cancela una matrícula confirmada, se libera un cupo
        if (matricula.estado === 'CONFIRMADA' && estado === 'CANCELADA') {
            await tx.seccion.update({
                where: { id: matricula.seccionId },
                data: { capacidadActual: { decrement: 1 } },
            });
        }
        // Si se confirma una matrícula pendiente, no se altera el cupo, pues ya se contó al crearla.
        
        return tx.matricula.update({ where: { id }, data: { estado } });
    });
};

export const registrarPago = async (id: string, fechaPago?: string) => {
  const matricula = await prisma.matricula.findUnique({ where: { id } });
  if (!matricula) {
    throw new ErrorAplicacion(404, 'Matrícula no encontrada.');
  }

  return prisma.matricula.update({
    where: { id },
    data: {
      estaPagado: true,
      fechaPago: fechaPago ? new Date(fechaPago) : new Date(),
    },
  });
};
