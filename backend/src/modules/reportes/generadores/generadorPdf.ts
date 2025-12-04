import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { Matricula, Estudiante, Seccion, Grado } from '@prisma/client';

type MatriculaCompleta = Matricula & {
    estudiante: Estudiante;
    seccion: Seccion & {
        grado: Grado;
    };
};

const generarFilasHtml = (datos: MatriculaCompleta[]): string => {
    return datos.map((matricula, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${matricula.codigo}</td>
            <td>${matricula.estudiante.dni}</td>
            <td>${matricula.estudiante.apellidos}, ${matricula.estudiante.nombres}</td>
            <td>${matricula.seccion.grado.nivel}</td>
            <td>${matricula.seccion.grado.numeroGrado}°</td>
            <td>${matricula.seccion.nombre}</td>
            <td>${matricula.fechaMatricula.toLocaleDateString('es-ES')}</td>
        </tr>
    `).join('');
};

export const generarPdfMatriculados = async (datos: MatriculaCompleta[], gestion: number): Promise<Buffer> => {
    const rutaPlantilla = path.join(__dirname, '../plantillas/reporte-matriculados.html');
    
    try {
        let html = await fs.readFile(rutaPlantilla, 'utf-8');

        const filas = generarFilasHtml(datos);
        const fechaActual = new Date().toLocaleDateString('es-ES');

        html = html.replace('{{filas}}', filas);
        html = html.replace(/{{gestion}}/g, gestion.toString());
        html = html.replace('{{fecha}}', fechaActual);
        
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '25px',
                right: '25px',
                bottom: '25px',
                left: '25px'
            }
        });

        await browser.close();
        return pdfBuffer;

    } catch (error) {
        console.error("Error al leer o procesar la plantilla HTML:", error);
        throw new Error("No se pudo generar el PDF. Verifique que la plantilla exista en la ruta correcta.");
    }
};