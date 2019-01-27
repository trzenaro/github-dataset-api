const { getAllActors, getStreak, updateActor } = require('../controllers/actors');
var express = require('express');
var router = express.Router();

// Routes related to actor.
router.get('/', getAllActors);
router.put('/', updateActor);
router.get('/streak', getStreak);

module.exports = router;
