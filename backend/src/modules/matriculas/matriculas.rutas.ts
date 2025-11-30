import { Router } from 'express';
import * as controlador from './matriculas.controlador';
import { autenticar, autorizar } from '../../middlewares/autenticacion.middleware';
import { validar } from '../../middlewares/validacion.middleware';
import {
  crearMatriculaEsquema,
  listarMatriculasEsquema,
  obtenerMatriculaEsquema,
  actualizarEstadoMatriculaEsquema,
  registrarPagoEsquema,
} from './matriculas.esquema';
import { RolUsuario } from '@prisma/client';

const router = Router();
router.use(autenticar);

const rolesVisualizacion = [RolUsuario.ADMIN, RolUsuario.DIRECTOR, RolUsuario.SECRETARIA];
const rolesModificacion = [RolUsuario.ADMIN, RolUsuario.SECRETARIA];

// POST /api/matriculas - Crear una nueva matrícula
router.post(
  '/',
  autorizar(...rolesModificacion),
  validar(crearMatriculaEsquema),
  controlador.crearMatricula,
);

// GET /api/matriculas - Listar todas las matrículas con paginación y filtros
router.get(
  '/',
  autorizar(...rolesVisualizacion),
  validar(listarMatriculasEsquema),
  controlador.listarMatriculas,
);

// GET /api/matriculas/:id - Obtener una matrícula por ID
router.get(
  '/:id',
  autorizar(...rolesVisualizacion),
  validar(obtenerMatriculaEsquema),
  controlador.obtenerMatricula,
);

// PATCH /api/matriculas/:id/estado - Actualizar el estado de una matrícula (confirmar, cancelar)
router.patch(
  '/:id/estado',
  autorizar(...rolesModificacion),
  validar(actualizarEstadoMatriculaEsquema),
  controlador.actualizarEstadoMatricula,
);

// POST /api/matriculas/:id/pago - Registrar el pago de una matrícula
router.post(
  '/:id/pago',
  autorizar(...rolesModificacion),
  validar(registrarPagoEsquema),
  controlador.registrarPago,
);

export default router;
