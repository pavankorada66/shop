const InventoryItem = require('../models/InventoryItem');


exports.additems=async (req, res) => {
  const { name, quantity, price } = req.body;

  if (!name || quantity == null || price == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newItem = new InventoryItem({ name, quantity, price });
    const savedItem = await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: savedItem });
  } catch (err) {
    res.status(500).json({ error: 'Error adding item to inventory', details: err.message });
  }
};

exports.getitems =async (req, res) => {
    try {
      const items = await InventoryItem.find(); 
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving inventory items', details: err.message });
    }
  };
  


