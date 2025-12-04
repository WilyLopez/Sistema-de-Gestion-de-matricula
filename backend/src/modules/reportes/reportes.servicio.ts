import { prisma } from '../../../config/baseDatos';
import { ApiError } from '../../../utils/respuesta.util';
import { generarExcelMatriculados } from './generadores/generadorExcel';
import { generarPdfMatriculados } from './generadores/generadorPdf';

export class ReportesServicio {
    
    constructor() {}

    async generarReporteMatriculados(gestion: number, tipo: 'PDF' | 'EXCEL') {

        const anioAcademico = await prisma.anioAcademico.findFirst({
            where: { anio: gestion }
        });

        if (!anioAcademico) {
            throw new ApiError(404, `No se encontró un año académico para la gestión ${gestion}`);
        }

        const matriculas = await prisma.matricula.findMany({
            where: {
                anioAcademicoId: anioAcademico.id,
                estado: 'CONFIRMADA'
            },
            include: {
                estudiante: true,
                seccion: {
                    include: {
                        grado: true
                    }
                }
            },
            orderBy: [
                { seccion: { grado: { nivel: 'asc' } } },
                { seccion: { grado: { numeroGrado: 'asc' } } },
                { seccion: { nombre: 'asc' } },
                { estudiante: { apellidos: 'asc' } }
            ]
        });

        if (matriculas.length === 0) {
            throw new ApiError(404, `No se encontraron matrículas confirmadas para la gestión ${gestion}`);
        }

        let buffer: Buffer;
        let tipoMime: string;
        let nombreArchivo: string;

        if (tipo === 'PDF') {
            buffer = await generarPdfMatriculados(matriculas, gestion);
            tipoMime = 'application/pdf';
            nombreArchivo = `reporte_matriculados_${gestion}.pdf`;
        } else {
            buffer = await generarExcelMatriculados(matriculas, gestion);
            tipoMime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            nombreArchivo = `reporte_matriculados_${gestion}.xlsx`;
        }

        return { buffer, tipoMime, nombreArchivo };
    }
}
