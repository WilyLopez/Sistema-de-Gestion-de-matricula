import { Prisma } from '@prisma/client';
import { prisma } from '../../config/baseDatos';
import { ErrorAplicacion } from '../../middlewares/errores.middleware';

// ========== Lógica de Negocio para Año Académico ==========

export const crearAnioAcademico = async (datos: Prisma.AnioAcademicoCreateInput) => {
  const anioExistente = await prisma.anioAcademico.findUnique({
    where: { anio: datos.anio },
  });
  if (anioExistente) {
    throw new ErrorAplicacion(409, 'El año académico ya está registrado.');
  }
  return prisma.anioAcademico.create({ data: datos });
};

export const listarAniosAcademicos = async () => {
  return prisma.anioAcademico.findMany({
    orderBy: { anio: 'desc' },
    include: {
      _count: {
        select: { grados: true, matriculas: true },
      },
    },
  });
};

export const obtenerAnioAcademicoPorId = async (id: string) => {
  const anio = await prisma.anioAcademico.findUnique({
    where: { id },
    include: {
      grados: {
        include: {
          secciones: true,
        },
      },
    },
  });
  if (!anio) {
    throw new ErrorAplicacion(404, 'Año académico no encontrado.');
  }
  return anio;
};

export const actualizarAnioAcademico = async (id: string, datos: Prisma.AnioAcademicoUpdateInput) => {
  const anioExistente = await prisma.anioAcademico.findUnique({ where: { id } });
  if (!anioExistente) {
    throw new ErrorAplicacion(404, 'Año académico no encontrado.');
  }

  // Lógica para asegurar que solo un año sea el "actual"
  if (datos.esActual === true) {
    await prisma.anioAcademico.updateMany({
      where: { esActual: true },
      data: { esActual: false },
    });
  }

  return prisma.anioAcademico.update({ where: { id }, data: datos });
};


// ========== Lógica de Negocio para Grado ==========

export const crearGrado = async (datos: Prisma.GradoCreateInput) => {
  // Prisma se encarga de la validación de unicidad con @@unique([anioAcademicoId, nivel, numeroGrado])
  // pero verificamos la existencia del año académico por si acaso
  const anioExistente = await prisma.anioAcademico.findUnique({
    where: { id: datos.anioAcademico.connect.id },
  });
  if (!anioExistente) {
    throw new ErrorAplicacion(404, 'El año académico especificado no existe.');
  }

  return prisma.grado.create({ data: datos });
};

export const listarGradosPorAnio = async (anioAcademicoId: string) => {
  return prisma.grado.findMany({
    where: { anioAcademicoId },
    orderBy: [{ nivel: 'asc' }, { numeroGrado: 'asc' }],
    include: {
        _count: { select: { secciones: true } }
    }
  });
};

export const obtenerGradoPorId = async (id: string) => {
  const grado = await prisma.grado.findUnique({
    where: { id },
    include: { anioAcademico: true, secciones: true },
  });
  if (!grado) {
    throw new ErrorAplicacion(404, 'Grado no encontrado.');
  }
  return grado;
};

export const actualizarGrado = async (id: string, datos: Prisma.GradoUpdateInput) => {
  const gradoExistente = await prisma.grado.findUnique({ where: { id } });
  if (!gradoExistente) {
    throw new ErrorAplicacion(404, 'Grado no encontrado.');
  }
  return prisma.grado.update({ where: { id }, data: datos });
};


// ========== Lógica de Negocio para Sección ==========

export const crearSeccion = async (datos: Prisma.SeccionCreateInput) => {
    const gradoExistente = await prisma.grado.findUnique({
        where: { id: datos.grado.connect.id },
      });
      if (!gradoExistente) {
        throw new ErrorAplicacion(404, 'El grado especificado no existe.');
      }

  return prisma.seccion.create({ data: datos });
};

export const listarSeccionesPorGrado = async (gradoId: string) => {
  return prisma.seccion.findMany({
    where: { gradoId },
    orderBy: { nombre: 'asc' },
  });
};

export const obtenerSeccionPorId = async (id: string) => {
  const seccion = await prisma.seccion.findUnique({
    where: { id },
    include: { grado: { include: { anioAcademico: true } } },
  });
  if (!seccion) {
    throw new ErrorAplicacion(404, 'Sección no encontrada.');
  }
  return seccion;
};

export const actualizarSeccion = async (id: string, datos: Prisma.SeccionUpdateInput) => {
  const seccionExistente = await prisma.seccion.findUnique({ where: { id } });
  if (!seccionExistente) {
    throw new ErrorAplicacion(404, 'Sección no encontrada.');
  }
  return prisma.seccion.update({ where: { id }, data: datos });
};
