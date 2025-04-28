// controllers/inventoryController.js
import Inventory from '../models/Inventory.model.js';
import {
  inventoryItemSchema,
  updateInventorySchema,
  filterSchema,
} from '../schemas/inventory.schema.js';

import { fromZodError } from 'zod-validation-error';

// Función para formatear mes/año para agrupar registros
const formatMonth = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};

// Obtener todos los registros con filtros opcionales
export const getInventario = async (req, res) => {
  try {
    // Validar filtros
    const validatedFilters = filterSchema.parse(req.query);

    // Construir filtro para la consulta
    const filter = {};

    if (validatedFilters.estado) {
      filter.estado = validatedFilters.estado;
    }

    if (validatedFilters.relevancia) {
      filter.relevancia = validatedFilters.relevancia;
    }

    // Filtro por rango de fechas
    if (validatedFilters.fechaInicio || validatedFilters.fechaFin) {
      filter.fecha = {};
      if (validatedFilters.fechaInicio) {
        filter.fecha.$gte = new Date(validatedFilters.fechaInicio);
      }
      if (validatedFilters.fechaFin) {
        filter.fecha.$lte = new Date(validatedFilters.fechaFin);
      }
    }

    // Realizar la consulta
    let query = Inventory.find(filter);

    // Ordenar por fecha (más reciente primero)
    query = query.sort({ fecha: -1 });

    // Ejecutar la consulta
    const inventario = await query;

    // Ordenar por valor si se solicita
    if (validatedFilters.valorOrden) {
      // Agrupar por mes
      const inventarioPorMes = inventario.reduce((acc, item) => {
        const mes = formatMonth(item.fecha);
        if (!acc[mes]) acc[mes] = [];
        acc[mes].push(item);
        return acc;
      }, {});

      // Ordenar dentro de cada mes
      for (const mes in inventarioPorMes) {
        inventarioPorMes[mes].sort((a, b) => {
          return validatedFilters.valorOrden === 'Alto'
            ? b.valor - a.valor
            : a.valor - b.valor;
        });
      }

      // Aplanar el resultado para devolverlo
      const inventarioOrdenado = [];
      for (const mes in inventarioPorMes) {
        inventarioOrdenado.push(...inventarioPorMes[mes]);
      }

      return res.status(200).json(inventarioOrdenado);
    }

    return res.status(200).json(inventario);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: fromZodError(error).message });
    }
    return res.status(500).json({
      error: 'Error al obtener inventario',
      details: error.message,
    });
  }
};

// Obtener un registro por ID
export const getInventarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventario = await Inventory.findById(id);

    if (!inventario) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    return res.status(200).json(inventario);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener el registro',
      details: error.message,
    });
  }
};

// Crear un nuevo registro
export const createInventario = async (req, res) => {
  try {
    // Validar los datos con Zod
    const validatedData = inventoryItemSchema.parse(req.body);

    // Crear el nuevo registro
    const nuevoInventario = new Inventory(validatedData);
    await nuevoInventario.save();

    return res.status(201).json({
      message: 'Registro creado exitosamente',
      data: nuevoInventario,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: fromZodError(error).message });
    }
    return res.status(500).json({
      error: 'Error al crear registro',
      details: error.message,
    });
  }
};

// Actualizar un registro existente
export const updateInventario = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar los datos con Zod
    const validatedData = updateInventorySchema.parse({
      id,
      ...req.body,
    });

    // Actualizar el registro
    const inventarioActualizado = await Inventory.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!inventarioActualizado) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    return res.status(200).json({
      message: 'Registro actualizado exitosamente',
      data: inventarioActualizado,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: fromZodError(error).message });
    }
    return res.status(500).json({
      error: 'Error al actualizar registro',
      details: error.message,
    });
  }
};

// Eliminar un registro
export const deleteInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const inventarioEliminado = await Inventory.findByIdAndDelete(id);

    if (!inventarioEliminado) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    return res.status(200).json({
      message: 'Registro eliminado exitosamente',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al eliminar registro',
      details: error.message,
    });
  }
};

// Obtener resumen estadístico
export const getStats = async (req, res) => {
  try {
    // Total de registros
    const totalRegistros = await Inventory.countDocuments();

    // Total por estado
    const porEstado = await Inventory.aggregate([
      { $group: { _id: '$estado', count: { $sum: 1 } } },
    ]);

    // Total por relevancia
    const porRelevancia = await Inventory.aggregate([
      { $group: { _id: '$relevancia', count: { $sum: 1 } } },
    ]);

    // Suma total de valores
    const sumTotal = await Inventory.aggregate([
      { $group: { _id: null, total: { $sum: '$valor' } } },
    ]);

    // Promedio de valores
    const promedioValor = await Inventory.aggregate([
      { $group: { _id: null, promedio: { $avg: '$valor' } } },
    ]);

    return res.status(200).json({
      totalRegistros,
      porEstado,
      porRelevancia,
      sumTotal: sumTotal.length > 0 ? sumTotal[0].total : 0,
      promedioValor: promedioValor.length > 0 ? promedioValor[0].promedio : 0,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener estadísticas',
      details: error.message,
    });
  }
};
