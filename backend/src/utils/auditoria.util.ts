import { RegistroAuditoria } from "../models/mongodb/registroAuditoria.modelo";
import { Request } from "express";
import { SolicitudAutenticada } from "../middlewares/autenticacion.middleware";

type AccionAuditoria = "CREAR" | "ACTUALIZAR" | "ELIMINAR" | "LEER";

interface DatosRegistroAuditoria {
    usuarioId: string;
    correoUsuario: string;
    accion: AccionAuditoria;
    entidad: string;
    entidadId: string;
    cambios?: {
        antes?: any;
        despues?: any;
    };
    direccionIp?: string;
    agenteUsuario?: string;
}

export const crearRegistroAuditoria = async (
    datos: DatosRegistroAuditoria
): Promise<void> => {
    try {
        await RegistroAuditoria.create(datos);
    } catch (error) {
        console.error("Error creando registro de auditoría:", error);
    }
};

export const auditarDesdeSolicitud = async (
    req: SolicitudAutenticada,
    accion: AccionAuditoria,
    entidad: string,
    entidadId: string,
    cambios?: { antes?: any; despues?: any }
): Promise<void> => {
    if (!req.usuario) return;

    await crearRegistroAuditoria({
        usuarioId: req.usuario.id,
        correoUsuario: req.usuario.correo,
        accion,
        entidad,
        entidadId,
        cambios,
        direccionIp: req.ip,
        agenteUsuario: req.get("user-agent"),
    });
};
