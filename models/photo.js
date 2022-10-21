const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    
  },
  { timestamps: true }
);
module.exports = mongoose.model("photo", photoSchema);
