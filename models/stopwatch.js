const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for todo
const WatchSchema = new Schema({
  timePassed: {
    type: Number,
    required: [true, 'The todo text field is required'],
    default: 0,
  },
  laps: []
})

//create model for todo
const Watch = mongoose.model('watch', WatchSchema);

module.exports = Watch;