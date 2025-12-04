import { Request, Response, NextFunction } from 'express';
import { ReportesServicio } from './reportes.servicio';
import { asyncHandler } from '../../../utils/respuesta.util';

export class ReportesControlador {
    
    private readonly servicio: ReportesServicio;

    constructor() {
        this.servicio = new ReportesServicio();
    }

    generarReporteMatriculados = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { gestion, tipo } = req.body;
        
        const { buffer, tipoMime, nombreArchivo } = await this.servicio.generarReporteMatriculados(gestion, tipo);

        res.setHeader('Content-Type', tipoMime);
        res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);
        res.send(buffer);
    });
}
