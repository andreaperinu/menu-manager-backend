const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  name: {
    type: String,
    required: true
  },

  items: [
    {
      type: Schema.Types.Mixed,
      ref: 'SubMenu'
    }
  ]

});

module.exports = mongoose.model('Menu', userSchema);
