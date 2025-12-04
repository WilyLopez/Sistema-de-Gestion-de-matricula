import { Router } from 'express';
import { ReportesControlador } from './reportes.controlador';
import { validarPeticion } from '../../middlewares/validacion.middleware';
import { generarReporteEsquema } from './reportes.esquema';

const router = Router();
const controlador = new ReportesControlador();

router.post(
    '/matriculados',
    validarPeticion(generarReporteEsquema),
    controlador.generarReporteMatriculados
);

export default router;
