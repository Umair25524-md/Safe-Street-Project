const Report=require('../models/Report');
const getReport=async (req, res) => {
    try {
      const reports = await Report.find(); // You can add .sort({ timestamp: -1 }) if needed
      console.log('Fetched reports:', reports);
      res.status(200).json(reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ message: 'Server error' });
    }
}
module.exports={getReport};