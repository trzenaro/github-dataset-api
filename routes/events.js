const { getAllEvents, addEvent, getByActor } = require('../controllers/events');
var express = require('express');
var router = express.Router();

// Routes related to event
router.get('/', getAllEvents);
router.post('/', addEvent);
router.get('/actors/:id', getByActor);

module.exports = router;
