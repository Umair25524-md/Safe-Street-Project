const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  address: String,
  landmark: String,
  roadType: String,
  comments: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  damage_summary: String,
  status: {
    type: String,
    default: 'unresolved',
  },
});

module.exports = mongoose.model('Report', reportSchema);
