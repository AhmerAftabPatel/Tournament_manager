const mongoose = require('mongoose')

var Schema = mongoose.Schema

const tournamentSchema = new Schema(
  {
    title: String,
    descrition: String,
    start_date: {
      type: String,
      requried: true,
    },
    register_by: {
      type: String,
      required: true,
    },
    registered_players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    generated_teams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    rounds: {
      type: Number,
      default: 0,
    },
    // rounds : [{
    //   type : Schema.Types.ObjectId,
    //   ref : 'Round'
    // }],
    hosted_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
)
module.exports = mongoose.model('Tournament', tournamentSchema)
