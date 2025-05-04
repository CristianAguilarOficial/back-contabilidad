import Inventario from '../models/inventory.model.js';

export const getInventario = async (req, res) => {
  try {
    const items = await Inventario.find({ user: req.user.id }).sort({});
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener inventario' });
  }
};

export const createInventario = async (req, res) => {
  try {
    const { producto, description, valor, estado, relevancia, fecha } =
      req.body;
    const nuevoItem = new Inventario({
      producto,
      description,
      valor,
      estado,
      relevancia,
      fecha,
      user: req.user.id,
    });
    const savedItem = await nuevoItem.save();
    res.json(savedItem);
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear inventario' });
  }
};

export const getInventarioById = async (req, res) => {
  try {
    const item = await Inventario.findById(req.params.id).populate('user');
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(item);
  } catch (error) {
    return res.status(404).json({ message: 'Item no encontrado' });
  }
};

export const updateInventario = async (req, res) => {
  try {
    const item = await Inventario.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar inventario' });
  }
};

export const deleteInventario = async (req, res) => {
  try {
    const item = await Inventario.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    return res.sendStatus(204); // Eliminado correctamente
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar inventario' });
  }
};
