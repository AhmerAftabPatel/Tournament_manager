const mongoose = require('mongoose')

var Schema = mongoose.Schema

const matchSchema = new Schema(
  {
    tournament_id: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
    },
    round_id: {
      type: Schema.Types.ObjectId,
      ref: 'Round',
    },
    home_team: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
      score: {
        type: Number,
        default: 0,
      },
    },
    away_team: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
      score: {
        type: Number,
        default: 0,
      },
    },
    round_number: {
      type: Number,
    },
    start_date: {
      type: Date,
    },
    officials: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    winner_id: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
  },
  { timestamps: true },
)
module.exports = mongoose.model('Match', matchSchema)
