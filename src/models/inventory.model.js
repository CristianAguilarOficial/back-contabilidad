// models/inventory.model.js
import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    producto: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    valor: {
      type: Number,
      required: true,
      min: 0,
    },
    estado: {
      type: String,
      required: true,
      enum: ['Importante', 'Poco importante', 'Nada importante'],
    },
    relevancia: {
      type: String,
      required: true,
      enum: ['Hogar', 'Empresa', 'Salud', 'Otros'],
    },
    fecha: {
      type: Date,
      required: true,
    },
    // ← Aquí asociamos cada ítem al usuario que lo creó
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false }
);

const Inventario = mongoose.model('Inventario', inventorySchema);
export default Inventario;
