const { eraseEvents } = require('../controllers/events');
var express = require('express');
var router = express.Router();

// Route related to delete events
router.delete('/', eraseEvents);

module.exports = router;
