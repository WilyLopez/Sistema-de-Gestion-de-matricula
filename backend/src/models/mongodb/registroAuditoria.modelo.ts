import mongoose, { Schema, Document } from "mongoose";

export interface IRegistroAuditoria extends Document {
    usuarioId: string;
    correoUsuario: string;
    accion: string;
    entidad: string;
    entidadId: string;
    cambios?: {
        antes?: any;
        despues?: any;
    };
    direccionIp?: string;
    agenteUsuario?: string;
    marcaTiempo: Date;
}

const EsquemaRegistroAuditoria = new Schema<IRegistroAuditoria>(
    {
        usuarioId: { type: String, required: true, index: true },
        correoUsuario: { type: String, required: true },
        accion: {
            type: String,
            required: true,
            enum: ["CREAR", "ACTUALIZAR", "ELIMINAR", "LEER"],
        },
        entidad: { type: String, required: true, index: true },
        entidadId: { type: String, required: true },
        cambios: {
            antes: Schema.Types.Mixed,
            despues: Schema.Types.Mixed,
        },
        direccionIp: String,
        agenteUsuario: String,
        marcaTiempo: { type: Date, default: Date.now, index: true },
    },
    {
        timestamps: true,
        collection: "registros_auditoria",
    }
);

// Índices compuestos para búsquedas frecuentes
EsquemaRegistroAuditoria.index({ entidad: 1, entidadId: 1, marcaTiempo: -1 });
EsquemaRegistroAuditoria.index({ usuarioId: 1, marcaTiempo: -1 });

export const RegistroAuditoria = mongoose.model<IRegistroAuditoria>(
    "RegistroAuditoria",
    EsquemaRegistroAuditoria
);
