const mongoose = require('mongoose')

var Schema = mongoose.Schema

const roundSchema = new Schema(
  {
    tournament_id: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
    },
    start_date: {
      type: Date,
    },
    round_number: {
      type: Number,
    },
    matches: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Match',
      },
    ],
  },
  { timestamps: true },
)
module.exports = mongoose.model('Round', roundSchema)
