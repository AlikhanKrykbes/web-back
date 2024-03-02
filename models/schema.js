const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourSchema = new Schema({
    tour: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    adults: {
        type: Number,
        required: true
    },
    children:{
        type: Number,
        required: true
    },
    arrivalDate:{
        type: Date,
        required: true
    },
    departureDate:{
        type: Date,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    // Add more fields as needed, such as wind speed, precipitation, etc.
});

const TourModel = mongoose.model('Tour', tourSchema);
module.exports = TourModel;