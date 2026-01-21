const mongoose = require('mongoose');

// Read-only City model for looking up city details
// City data is owned by catalog-service, this is just for reads
const citySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    continent: { type: String, required: true },
    tags: [String],
    popularSpots: [String],
    image: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('City', citySchema);
