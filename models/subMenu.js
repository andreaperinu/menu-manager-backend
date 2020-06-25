const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({

  name: {
    type: String,
    required: true
  },

  items: [
    {
      type: Schema.Types.Mixed,
      ref: 'Dish'
    }
  ]

});

module.exports = mongoose.model('SubMenu', dishSchema);
