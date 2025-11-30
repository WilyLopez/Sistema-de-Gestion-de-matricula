import { Router } from "express";
import * as controlador from "./apoderados.controlador";
import {
    autenticar,
    autorizar,
} from "../../middlewares/autenticacion.middleware";
import { validar } from "../../middlewares/validacion.middleware";
import {
    crearApoderadoEsquema,
    actualizarApoderadoEsquema,
    obtenerApoderadoEsquema,
    listarApoderadosEsquema,
} from "./apoderados.esquema";
import { RolUsuario } from "@prisma/client";

const router = Router();

router.use(autenticar);

const rolesVisualizacion = [
    RolUsuario.ADMIN,
    RolUsuario.DIRECTOR,
    RolUsuario.SECRETARIA,
];
const rolesModificacion = [RolUsuario.ADMIN, RolUsuario.SECRETARIA];

router.post(
    "/",
    autorizar(...rolesModificacion),
    validar(crearApoderadoEsquema),
    controlador.crearApoderado
);

router.get(
    "/",
    autorizar(...rolesVisualizacion),
    validar(listarApoderadosEsquema),
    controlador.listarApoderados
);

router.get(
    "/:id",
    autorizar(...rolesVisualizacion),
    validar(obtenerApoderadoEsquema),
    controlador.obtenerApoderado
);

router.put(
    "/:id",
    autorizar(...rolesModificacion),
    validar(actualizarApoderadoEsquema),
    controlador.actualizarApoderado
);

export default router;
