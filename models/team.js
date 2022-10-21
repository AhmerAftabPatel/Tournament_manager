const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    players : [{
        type : Schema.Types.ObjectId,
        ref : "User"
    }],
    captain_id : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    tournament_id : {
        type : Schema.Types.ObjectId,
        ref : "Tournament"
    },
    wins : {type : Number, default : 0},
    losses : {type : Number, default : 0},
    points :  {type : Number, default : 0},
    pointDifference : {type : Number, default : 0},
    rank : {type : Number, default : 0},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Team", teamSchema);
