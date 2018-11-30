const mongoose = require('mongoose');

// https://docs.mongodb.com/v3.0/tutorial/create-an-auto-incrementing-field/#use-counters-collection
const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const CounterModel = mongoose.model('Counter', CounterSchema);

module.exports = CounterModel;