// inventorySchema.js
import { z } from 'zod';

// Zod schema for inventory items
export const inventoryItemSchema = z.object({
  id: z.string().uuid().optional(), // Will be generated if not provided
  producto: z.string().min(1, { message: 'El producto es requerido' }),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
  valor: z.number().positive({ message: 'El valor debe ser positivo' }),
  estado: z.enum(['Importante', 'Poco importante', 'Nada importante'], {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),
  relevancia: z.enum(['Hogar', 'Empresa', 'Salud', 'Otros'], {
    errorMap: () => ({ message: 'Relevancia inválida' }),
  }),
  fecha: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'Formato de fecha inválido',
  }),
  createdAt: z.date().optional(), // Automatically set when created
  updatedAt: z.date().optional(), // Automatically updated
});

// Schema for filtering inventory items
export const filterSchema = z.object({
  estado: z
    .enum(['Importante', 'Poco importante', 'Nada importante', ''])
    .optional(),
  relevancia: z.enum(['Hogar', 'Empresa', 'Salud', 'Otros', '']).optional(),
  valorOrden: z.enum(['Alto', 'Bajo', '']).optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
});

// Schema for updating inventory items
export const updateInventorySchema = inventoryItemSchema.partial().extend({
  id: z.string().uuid({ message: 'ID inválido' }),
});
