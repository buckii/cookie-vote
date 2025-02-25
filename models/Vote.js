const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    picks: Array,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }, { collection: 'nachamber' });
   
  module.exports = mongoose.model("Vote", voteSchema);