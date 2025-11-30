import bcrypt from "bcryptjs";

const RONDAS_SAL = 10;

export const encriptarContrasena = async (
    contrasena: string
): Promise<string> => {
    return await bcrypt.hash(contrasena, RONDAS_SAL);
};

export const compararContrasena = async (
    contrasena: string,
    contrasenaEncriptada: string
): Promise<boolean> => {
    return await bcrypt.compare(contrasena, contrasenaEncriptada);
};
