import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { entorno } from "./config/entorno";
import {
    manejadorErrores,
    manejadorNoEncontrado,
} from "./middlewares/errores.middleware";

// Importar rutas
import rutasAutenticacion from "./modules/autenticacion/autenticacion.rutas";
// import rutasEstudiantes from './modules/estudiantes/estudiantes.rutas';
// import rutasMatriculas from './modules/matriculas/matriculas.rutas';
// import rutasAcademico from './modules/academico/academico.rutas';
// import rutasApoderados from './modules/apoderados/apoderados.rutas';
// import rutasUsuarios from './modules/usuarios/usuarios.rutas';
// import rutasReportes from './modules/reportes/reportes.rutas';

const app: Application = express();

// Middlewares de seguridad
app.use(helmet());
app.use(
    cors({
        origin: entorno.URL_FRONTEND,
        credentials: true,
    })
);

// Limitación de peticiones
const limitador = rateLimit({
    windowMs: entorno.VENTANA_LIMITE_MS,
    max: entorno.MAX_PETICIONES,
    message: "Demasiadas peticiones desde esta IP, intenta de nuevo más tarde",
});
app.use(limitador);

// Middlewares generales
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logger
if (entorno.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// Verificación de salud
app.get("/salud", (req, res) => {
    res.json({
        estado: "ok",
        marcaTiempo: new Date().toISOString(),
        entorno: entorno.NODE_ENV,
    });
});

// Rutas de la API
const PREFIJO_API = entorno.PREFIJO_API;

app.use(`${PREFIJO_API}/autenticacion`, rutasAutenticacion);
// app.use(`${PREFIJO_API}/estudiantes`, rutasEstudiantes);
// app.use(`${PREFIJO_API}/matriculas`, rutasMatriculas);
// app.use(`${PREFIJO_API}/academico`, rutasAcademico);
// app.use(`${PREFIJO_API}/apoderados`, rutasApoderados);
// app.use(`${PREFIJO_API}/usuarios`, rutasUsuarios);
// app.use(`${PREFIJO_API}/reportes`, rutasReportes);

// Manejo de errores
app.use(manejadorNoEncontrado);
app.use(manejadorErrores);

export default app;
