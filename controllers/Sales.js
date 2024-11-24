const SalesLog = require('../models/Saleslog');
const InventoryItem = require('../models/InventoryItem');



exports.sellitems =async (req, res) => {
  const { items } = req.body; 

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items list is required and must be non-empty' });
  }
  
  try {
    let totalAmount = 0;
    const billItems = [];


    const session = await InventoryItem.startSession();
    session.startTransaction();

    try {
      for (const { name, quantity } of items) {
        if (!name || quantity == null || quantity <= 0) {
          throw new Error(`Invalid item data: ${JSON.stringify({ name, quantity })}`);
        }

        
        const item = await InventoryItem.findOne({ name }).session(session);

        if (!item) {
          throw new Error(`Item "${name}" not found in inventory`);
        }

        if (item.quantity < quantity) {
          throw new Error(`Not enough stock for item "${name}". Available: ${item.quantity}, Requested: ${quantity}`);
        }

      
        item.quantity -= quantity;
        await item.save({ session });

        
        const itemTotal = item.price * quantity;
        totalAmount += itemTotal;

        
        billItems.push({
          name: item.name,
          quantity,
          price: item.price,
          total: itemTotal,
        });
      }

      
      const salesLog = new SalesLog({
        items: billItems,
        totalAmount,
      });
      await salesLog.save({ session });

    
      await session.commitTransaction();
      session.endSession();

      
      res.status(200).json({
        message: 'Bill generated successfully',
        bill: {
          items: billItems,
          totalAmount,
        },
      });
    } catch (error) {
      
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logs=async (req, res) => {
    const { page = 1, limit = 10 } = req.query; 
  
    try {
      const salesLogs = await SalesLog.find()
        .sort({ createdAt: -1 }) 
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalLogs = await SalesLog.countDocuments();
      res.status(200).json({
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalLogs / limit),
        totalLogs,
        salesLogs,
      });
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving sales logs', details: err.message });
    }
  };
  