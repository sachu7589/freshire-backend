const mongoose = require('mongoose');

const contactUpdateSchema = new mongoose.Schema({
    employeeid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    view: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ContactUpdate', contactUpdateSchema);