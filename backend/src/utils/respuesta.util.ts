import { Response } from "express";

interface RespuestaExitosa<T = any> {
    exito: true;
    datos: T;
    mensaje?: string;
}

interface RespuestaError {
    exito: false;
    mensaje: string;
    errores?: any;
}

interface RespuestaPaginada<T = any> extends RespuestaExitosa<T> {
    paginacion: {
        pagina: number;
        limite: number;
        total: number;
        totalPaginas: number;
    };
}

export const respuestaExitosa = <T>(
    res: Response,
    datos: T,
    mensaje?: string,
    codigoEstado: number = 200
): Response => {
    return res.status(codigoEstado).json({
        exito: true,
        datos,
        ...(mensaje && { mensaje }),
    } as RespuestaExitosa<T>);
};

export const respuestaError = (
    res: Response,
    mensaje: string,
    codigoEstado: number = 400,
    errores?: any
): Response => {
    return res.status(codigoEstado).json({
        exito: false,
        mensaje,
        ...(errores && { errores }),
    } as RespuestaError);
};

export const respuestaPaginada = <T>(
    res: Response,
    datos: T,
    pagina: number,
    limite: number,
    total: number,
    mensaje?: string
): Response => {
    return res.status(200).json({
        exito: true,
        datos,
        ...(mensaje && { mensaje }),
        paginacion: {
            pagina,
            limite,
            total,
            totalPaginas: Math.ceil(total / limite),
        },
    } as RespuestaPaginada<T>);
};
