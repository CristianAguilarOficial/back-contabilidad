// routes/inventoryRoutes.js
import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
  getInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
} from '../controllers/inventory.controller.js';
import { validateShema } from '../middlewares/validator.widdlewares.js';
import { inventoryItemSchema } from '../schemas/inventory.schema.js';

const router = Router();

// Rutas del inventario (sin repetir 'inventario' porque ya lo monta app.js)
router.get('/', authRequired, getInventario); // GET  /api/inventario
router.get('/:id', authRequired, getInventarioById); // GET  /api/inventario/:id
router.post(
  '/',
  authRequired,
  validateShema(inventoryItemSchema),
  createInventario // POST /api/inventario
);
router.put('/:id', authRequired, updateInventario); // PUT  /api/inventario/:id
router.delete('/:id', authRequired, deleteInventario); // DELETE /api/inventario/:id

export default router;
