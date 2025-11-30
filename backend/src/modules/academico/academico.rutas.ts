import { Router } from 'express';
import * as controlador from './academico.controlador';
import { autenticar, autorizar } from '../../middlewares/autenticacion.middleware';
import { validar } from '../../middlewares/validacion.middleware';
import {
  anioIdEsquema,
  crearAnioAcademicoEsquema,
  actualizarAnioAcademicoEsquema,
  gradoIdEsquema,
  crearGradoEsquema,
  actualizarGradoEsquema,
  seccionIdEsquema,
  crearSeccionEsquema,
  actualizarSeccionEsquema,
} from './academico.esquema';
import { RolUsuario } from '@prisma/client';

const router = Router();
router.use(autenticar);

// Roles
const rolesAdminDir = [RolUsuario.ADMIN, RolUsuario.DIRECTOR];
const rolesAdminDirSec = [...rolesAdminDir, RolUsuario.SECRETARIA];

// ========== Rutas para Año Académico ==========
router
  .route('/anios')
  .post(autorizar(...rolesAdminDir), validar(crearAnioAcademicoEsquema), controlador.crearAnioAcademico)
  .get(autorizar(...rolesAdminDirSec), controlador.listarAniosAcademicos);

router
  .route('/anios/:anioId')
  .get(autorizar(...rolesAdminDirSec), validar(anioIdEsquema), controlador.obtenerAnioAcademico)
  .put(autorizar(...rolesAdminDir), validar(actualizarAnioAcademicoEsquema), controlador.actualizarAnioAcademico);

// ========== Rutas para Grado ==========
// Rutas anidadas bajo año académico
router
  .route('/anios/:anioId/grados')
  .get(autorizar(...rolesAdminDirSec), validar(anioIdEsquema), controlador.listarGradosPorAnio);

// Rutas directas para grado
router.post('/grados', autorizar(...rolesAdminDir), validar(crearGradoEsquema), controlador.crearGrado);

router
  .route('/grados/:gradoId')
  .get(autorizar(...rolesAdminDirSec), validar(gradoIdEsquema), controlador.obtenerGrado)
  .put(autorizar(...rolesAdminDir), validar(actualizarGradoEsquema), controlador.actualizarGrado);

// ========== Rutas para Sección ==========
// Rutas anidadas bajo grado
router
  .route('/grados/:gradoId/secciones')
  .get(autorizar(...rolesAdminDirSec), validar(gradoIdEsquema), controlador.listarSeccionesPorGrado);

// Rutas directas para sección
router.post('/secciones', autorizar(...rolesAdminDirSec), validar(crearSeccionEsquema), controlador.crearSeccion);

router
  .route('/secciones/:seccionId')
  .get(autorizar(...rolesAdminDirSec), validar(seccionIdEsquema), controlador.obtenerSeccion)
  .put(autorizar(...rolesAdminDirSec), validar(actualizarSeccionEsquema), controlador.actualizarSeccion);

export default router;
