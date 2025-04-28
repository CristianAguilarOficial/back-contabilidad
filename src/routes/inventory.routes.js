// routes/inventoryRoutes.js
import express from 'express';
import {
  getInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
  getStats,
} from '../controllers/inventory.controller.js';

const router = express.Router();

// Rutas para el inventario
router.get('/', getInventario);
router.get('/stats', getStats);
router.get('/:id', getInventarioById);
router.post('/', createInventario);
router.put('/:id', updateInventario);
router.delete('/:id', deleteInventario);

export default router;
