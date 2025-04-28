// models/Inventory.js
import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    producto: {
      type: String,
      required: [true, 'El producto es requerido'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
    },
    valor: {
      type: Number,
      required: [true, 'El valor es requerido'],
      min: [0, 'El valor debe ser positivo'],
    },
    estado: {
      type: String,
      required: [true, 'El estado es requerido'],
      enum: {
        values: ['Importante', 'Poco importante', 'Nada importante'],
        message: 'Estado no válido',
      },
    },
    relevancia: {
      type: String,
      required: [true, 'La relevancia es requerida'],
      enum: {
        values: ['Hogar', 'Empresa', 'Salud', 'Otros'],
        message: 'Relevancia no válida',
      },
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha es requerida'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Método para formatear la fecha en formato amigable
inventorySchema.methods.formatDate = function () {
  const date = new Date(this.fecha);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Método estático para filtrar por mes
inventorySchema.statics.getByMonth = async function (month, year) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return this.find({
    fecha: { $gte: startDate, $lte: endDate },
  }).sort({ fecha: -1 });
};

// Crear y exportar el modelo
const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
