const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    operationCount: {
        adds: { type: Number, default: 0 },
        updates: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

const Data = mongoose.model('Data', dataSchema);
module.exports = Data;
