const User = require('../models/user')
const Tournament = require('../models/tournament')
const Rounds = require('../models/rounds')
const Teams = require('../models/team')
const Matches = require('../models/match')
const moment = require('moment')

exports.createTournament = (req, res) => {
  const { title, description, start_date, register_by } = req.body
  // if(start_date < )
  const new_tournament = new Tournament({
    title,
    description,
    start_date: new Date(start_date).getTime(),
    register_by: new Date(register_by).getTime(),
  })
  new_tournament.hosted_by = req.user._id
  new_tournament.save((err, saved) => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        error: err,
      })
    }
    res.json({
      status: true,
      message: 'Tournament Created',
    })
  })
}

exports.registerPlayer = (req, res) => {
  const { _id } = req.user

  Tournament.findByIdAndUpdate(req.body.tournament_id, {
    $addToSet: { registered_players: _id },
  }).exec((err, tour) => {
    if (err) {
      res.status(400).json({
        error: 'Could not register',
      })
    }
    res.json('Registered')
  })
}
//get tournament basic details
exports.getAllTournament = (req, res) => {
  Tournament.find().exec((err, tourn) => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        error: 'No tournament found',
      })
    }
    res.json(tourn)
  })
}
exports.getTournamentById = (req, res) => {
  Tournament.findById(req.params.tournament_id).exec((err, tourn) => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        error: 'no tournament found',
      })
    }
    res.json(tourn)
  })
}
//get tournemnt runds
exports.getTournamentRoundsandMatches = (req, res) => {
  const { tournament_id } = req.params
  Matches.find({ tournament_id }).exec((err, rounds) => {
    res.json(rounds)
  })
}

exports.getTournamentMatchById = (req, res) => {
  const { match_id } = req.params
  Matches.findById(match_id).exec((err, match) => {
    res.json(match)
  })
}
//updatematches

exports.updateMatchScore = (req, res) => {
  const {  team_type, score } = req.body
  if (!score) {
    return res.status(404).json({
      error: 'score is required',
    })
  } if (!req.params.match_id) {
    return res.status(404).json({
      error: 'match_id is required',
    })
  }
  if (!team_type) {
    return res.status(404).json({
      error: 'team_type is required',
    })
  }
  Matches.findById(req.params.match_id).exec((err, match) => {
    if (score < match.home_team.score) {
      return res.status(400).json({
        error: 'Score cannot be less than existing score',
      })
    }
    if (team_type === 'home_team') {
      match.home_team.score = score
    } else if (team_type === 'away_team') {
      match.away_team.score = score
    }
    match.save();
    res.json(match)
  })
}
//et single Round
exports.getTournamentRound = (req, res) => {
  const { round_id } = req.body
  Rounds.findById(round_id).exec((err, round) => {
    res.json(round)
  })
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
const createTeams = (players, id) => {
  let teams = []
  while (players.length > 0) {
    let p1 = players.shift()
    let p2 = players.pop()
    teams.push({ players: [p1, p2], tournament_id: id, captain_id: p1 })
  }
  return teams
}

function makeRoundRobinPairings(teams) {
  if (teams.length % 2 == 1) {
    teams.push(null)
  }

  const playerCount = teams.length
  const rounds = playerCount - 1
  const half = playerCount / 2

  const tournamentPairings = []

  const playerIndexes = teams.map((_, i) => i).slice(1)
  console.log(playerIndexes)

  for (let round = 0; round < rounds; round++) {
    const roundPairings = []

    const newPlayerIndexes = [0].concat(playerIndexes)

    const firstHalf = newPlayerIndexes.slice(0, half)
    const secondHalf = newPlayerIndexes.slice(half, playerCount).reverse()
    for (let i = 0; i < firstHalf.length; i++) {
      roundPairings.push({
        team1: teams[firstHalf[i]],
        team2: teams[secondHalf[i]],
      })
    }

    // rotating the array
    playerIndexes.push(playerIndexes.shift())
    tournamentPairings.push(roundPairings)
  }
  return tournamentPairings
}

// generate teams and rounds for tournemtnt with registered players
exports.generateTeamsAndRounds = (req, res) => {
  Tournament.findById(req.params.tournament_id).exec(async (err, tourn) => {
    let teams = await createTeams(tourn.registered_players, tourn._id)
    console.log(teams, 'created Teams')
    let createdTeams

    try {
      createdTeams = await Teams.insertMany(teams)
    } catch (err) {
      console.log(err)
    }
    let teamsArray = []
    createdTeams.forEach((team, index) => {
      teamsArray.push(team._id)
    })
    console.log(teamsArray, 'teamsArray')
    let pairings = makeRoundRobinPairings(teamsArray)
    console.log(pairings, 'pairings', createdTeams)
    let matches = []
    pairings.forEach((pairs, index) => {
      pairs.forEach((pair, i) => {
        if (pair.team1 !== null && pair.team2 !== null)
          matches.push({
            home_team: { id: pair.team1 },
            away_team: { id: pair.team2 },
            tournament_id: tourn._id,
            round_number: index + 1,
          })
      })
    })
    let insertMatches
    try {
      insertMatches = await Matches.insertMany(matches)
    } catch (err) {
      res.json({
        error: 'Operation failed',
      })
    }
    if (insertMatches) {
      Tournament.findByIdAndUpdate(tourn._id, {
        $set: { rounds: pairings.length },
        $addToSet: { generated_teams: teamsArray },
      }).exec((err, result) => {
        res.json(result)
      })
    }
  })
  // })
}
