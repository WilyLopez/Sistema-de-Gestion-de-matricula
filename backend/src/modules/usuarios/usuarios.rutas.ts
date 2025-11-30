import { Router } from "express";
import * as controlador from "./usuarios.controlador";
import {
    autenticar,
    autorizar,
} from "../../middlewares/autenticacion.middleware";
import { validar } from "../../middlewares/validacion.middleware";
import {
    actualizarUsuarioEsquema,
    cambiarEstadoUsuarioEsquema,
    obtenerUsuarioEsquema,
} from "./usuarios.esquema";
import { RolUsuario } from "@prisma/client";

const router = Router();

router.use(autenticar);

router.get("/", autorizar(RolUsuario.ADMIN), controlador.obtenerUsuarios);

router.get("/:id", validar(obtenerUsuarioEsquema), controlador.obtenerUsuario);

router.put(
    "/:id",
    validar(actualizarUsuarioEsquema),
    controlador.actualizarUsuario
);

router.patch(
    "/:id/estado",
    autorizar(RolUsuario.ADMIN),
    validar(cambiarEstadoUsuarioEsquema),
    controlador.cambiarEstadoUsuario
);

export default router;
