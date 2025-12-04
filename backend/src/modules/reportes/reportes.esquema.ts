import { z } from 'zod';

export const generarReporteEsquema = z.object({
  body: z.object({
    gestion: z.number().int().positive().min(2000).max(new Date().getFullYear() + 1),
    tipo: z.enum(['PDF', 'EXCEL']),
  }),
});
