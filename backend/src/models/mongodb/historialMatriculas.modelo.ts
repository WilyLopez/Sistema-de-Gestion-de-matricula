import mongoose, { Schema, Document } from "mongoose";

export interface IHistorialMatricula extends Document {
    matriculaId: string;
    estudianteId: string;
    nombreEstudiante: string;
    anioAcademico: number;
    grado: string;
    seccion: string;
    estado: string;
    fechaMatricula: Date;
    costoTotal: number;
    estadoPago: string;
    modificadoPor: string;
    fechaModificacion: Date;
    cambios?: any;
    instantanea: any; 
}

const EsquemaHistorialMatricula = new Schema<IHistorialMatricula>(
    {
        matriculaId: { type: String, required: true, index: true },
        estudianteId: { type: String, required: true, index: true },
        nombreEstudiante: { type: String, required: true },
        anioAcademico: { type: Number, required: true, index: true },
        grado: { type: String, required: true },
        seccion: { type: String, required: true },
        estado: { type: String, required: true },
        fechaMatricula: { type: Date, required: true },
        costoTotal: { type: Number, required: true },
        estadoPago: { type: String, required: true },
        modificadoPor: { type: String, required: true },
        fechaModificacion: { type: Date, default: Date.now },
        cambios: Schema.Types.Mixed,
        instantanea: { type: Schema.Types.Mixed, required: true },
    },
    {
        timestamps: true,
        collection: "historial_matriculas",
    }
);

EsquemaHistorialMatricula.index({ matriculaId: 1, fechaModificacion: -1 });
EsquemaHistorialMatricula.index({ estudianteId: 1, anioAcademico: -1 });

export const HistorialMatricula = mongoose.model<IHistorialMatricula>(
    "HistorialMatricula",
    EsquemaHistorialMatricula
);
