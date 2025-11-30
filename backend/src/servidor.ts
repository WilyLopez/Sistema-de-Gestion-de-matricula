import app from "./app";
import { entorno } from "./config/entorno";
import { conectarPostgreSQL, conectarMongoDB } from "./config/baseDatos";

const iniciarServidor = async () => {
    try {
        await conectarPostgreSQL();
        await conectarMongoDB();

        const PUERTO = entorno.PUERTO;
        app.listen(PUERTO, () => {
            console.log(`                                 
            Servidor: http://localhost:${PUERTO}     
            Entorno: ${entorno.NODE_ENV.padEnd(24)}
      `);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

iniciarServidor();
