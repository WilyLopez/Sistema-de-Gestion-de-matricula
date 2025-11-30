import { Router } from "express";
import {
    iniciarSesion,
    registrar,
    actualizarToken,
    obtenerPerfil,
} from "./autenticacion.controlador";
import { validar } from "../../middlewares/validacion.middleware";
import { autenticar } from "../../middlewares/autenticacion.middleware";
import {
    esquemaInicioSesion,
    esquemaRegistro,
    esquemaTokenActualizacion,
} from "./autenticacion.esquema";

const router = Router();

router.post("/iniciar-sesion", validar(esquemaInicioSesion), iniciarSesion);
router.post("/registrar", validar(esquemaRegistro), registrar);
router.post(
    "/actualizar-token",
    validar(esquemaTokenActualizacion),
    actualizarToken
);
router.get("/perfil", autenticar, obtenerPerfil);

export default router;
