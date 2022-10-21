const express = require('express')
var router = express.Router()

const {
  createTournament,
  registerPlayer,
  getAllTournament,
  getTournamentById,
  getTournamentRoundsandMatches,
  generateTeamsAndRounds,
  getTournamentMatchById,
  updateMatchScore
} = require('../controllers/tournament')
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require('../controllers/authentication')

router.post(
  '/tournament',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createTournament,
)
router.get(
  '/tournament',
  isSignedIn,
  isAuthenticated,
  getAllTournament,
)
router.get(
  '/tournament/:tournament_id',
  isSignedIn,
  isAuthenticated,
  getTournamentById,
)
router.get(
  '/matches/:tournament_id',
  isSignedIn,
  isAuthenticated,
  getTournamentRoundsandMatches,
)

router.post(
  '/tournament/generate/:tournament_id',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  generateTeamsAndRounds,
)
router.post('/tournament/register', isSignedIn, isAuthenticated, registerPlayer)
router.get('/match/:match_id', isSignedIn, isAuthenticated, getTournamentMatchById)
router.put('/match/:match_id', isSignedIn, isAuthenticated,isAdmin, updateMatchScore)

module.exports = router
