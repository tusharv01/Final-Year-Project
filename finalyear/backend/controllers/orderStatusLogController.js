import * as logService from '../services/orderStatusLogService.js';

export const changeStatus = async (req, res) => {
  try {
    const { orderId, status, location } = req.body;
    const adminId = req.user.id;

    const result = await logService.updateOrderStatus(orderId, status, location, adminId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const fetchLogs = async (req, res) => {
  try {
    const { orderId } = req.params;
    const logs = await logService.getStatusLogs(orderId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
