import { z } from 'zod';
export const inventoryItemSchema = z.object({
  producto: z.string().min(1, 'El producto es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  valor: z.number().positive('El valor debe ser positivo'),
  estado: z.enum(['Importante', 'Poco importante', 'Nada importante']),
  relevancia: z.enum(['Hogar', 'Empresa', 'Salud', 'Otros']),
  fecha: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), 'Formato de fecha inválido'),
});
