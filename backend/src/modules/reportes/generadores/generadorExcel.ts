import * as exceljs from 'exceljs';
import { Matricula, Estudiante, Seccion, Grado, NivelEducativo } from '@prisma/client';

type MatriculaCompleta = Matricula & {
    estudiante: Estudiante;
    seccion: Seccion & {
        grado: Grado;
    };
};

export const generarExcelMatriculados = async (datos: MatriculaCompleta[], gestion: number): Promise<Buffer> => {
    const workbook = new exceljs.Workbook();
    workbook.creator = 'Sistema de Gestión de Matrículas';
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet(`Matriculados ${gestion}`);

    worksheet.mergeCells('A1:H1');
    const titulo = worksheet.getCell('A1');
    titulo.value = `Reporte de Estudiantes Matriculados - Gestión ${gestion}`;
    titulo.font = { name: 'Calibri', size: 16, bold: true };
    titulo.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getRow(3).values = [
        'N°',
        'Código Matrícula',
        'DNI Estudiante',
        'Apellidos y Nombres',
        'Nivel',
        'Grado',
        'Sección',
        'Fecha de Matrícula'
    ];
    worksheet.getRow(3).font = { bold: true };

    let numeroFila = 4;
    datos.forEach((matricula, index) => {
        worksheet.getRow(numeroFila).values = [
            index + 1,
            matricula.codigo,
            matricula.estudiante.dni,
            `${matricula.estudiante.apellidos}, ${matricula.estudiante.nombres}`,
            matricula.seccion.grado.nivel,
            `${matricula.seccion.grado.numeroGrado}°`,
            matricula.seccion.nombre,
            matricula.fechaMatricula.toLocaleDateString('es-ES')
        ];
        numeroFila++;
    });

    worksheet.columns.forEach(column => {
        let maxLength = 0;
        if (column.values) {
            column.values.forEach(value => {
                const columnLength = value ? value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
        }
        column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
};
