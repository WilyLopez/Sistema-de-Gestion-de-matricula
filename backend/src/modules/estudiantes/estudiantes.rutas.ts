import { Router } from 'express';
import * as controlador from './estudiantes.controlador';
import { autenticar, autorizar } from '../../middlewares/autenticacion.middleware';
import { validar } from '../../middlewares/validacion.middleware';
import {
  crearEstudianteEsquema,
  actualizarEstudianteEsquema,
  obtenerEstudianteEsquema,
  listarEstudiantesEsquema,
  cambiarEstadoEstudianteEsquema,
} from './estudiantes.esquema';
import { RolUsuario } from '@prisma/client';

const router = Router();

router.use(autenticar);

const rolesVisualizacion = [RolUsuario.ADMIN, RolUsuario.DIRECTOR, RolUsuario.SECRETARIA];
const rolesModificacion = [RolUsuario.ADMIN, RolUsuario.SECRETARIA];

router.post(
  '/',
  autorizar(...rolesModificacion),
  validar(crearEstudianteEsquema),
  controlador.crearEstudiante,
);

router.get(
  '/',
  autorizar(...rolesVisualizacion),
  validar(listarEstudiantesEsquema),
  controlador.listarEstudiantes,
);

router.get(
  '/:id',
  autorizar(...rolesVisualizacion),
  validar(obtenerEstudianteEsquema),
  controlador.obtenerEstudiante,
);

router.put(
  '/:id',
  autorizar(...rolesModificacion),
  validar(actualizarEstudianteEsquema),
  controlador.actualizarEstudiante,
);

router.patch(
  '/:id/estado',
  autorizar(RolUsuario.ADMIN),
  validar(cambiarEstadoEstudianteEsquema),
  controlador.cambiarEstadoEstudiante,
);

export default router;
