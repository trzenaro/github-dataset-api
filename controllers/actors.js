const asyncErrorHandler = require('./utils/asyncErrorHandler');
const moment = require('moment');
const _ = require('lodash');
const Sequelize = require('sequelize');
const Actor = require('../models/actor');
const Event = require('../models/event');

const getAllActors = async (req, res, next) => {
	const actors = await Actor.findAll({
		attributes: {
			include: [
				[Sequelize.fn('COUNT', Sequelize.col('*')), 'eventQty'],
				[Sequelize.fn('MAX', Sequelize.col('events.created_at')), 'lastEvent']
			]
		},
		include: [{ model: Event }],
		group: ['actor.id'],
		order: [[Sequelize.literal('eventQty'), 'DESC'], [Sequelize.literal('lastEvent'), 'DESC'], ['login']]
	});

	let allActos = actors.map((actor) => {
		return {
			id: actor.id,
			login: actor.login,
			avatar_url: actor.avatar_url
		};
	});

	res.status(200).send(allActos);
};

const updateActor = async (req, res, next) => {
	let actorBody = req.body;
	let actorStored = await Actor.findByPk(actorBody.id);

	if (!actorStored) return res.status(404).send();

	if (actorStored.login !== actorBody.login) return res.status(400).send();

	await Actor.update({ avatar_url: actorBody.avatar_url }, { where: { id: actorBody.id } });

	res.status(200).send();
};

const getStreak = async (req, res) => {
	let events = await Event.findAll({
		include: [{ model: Actor }],
		order: [['actor_id'], ['created_at', 'DESC']]
	});

	let streakInfo = loadStreakData(events);
	let streakInfoOrdered = _.orderBy(streakInfo, ['maxStreak', 'dateLatestEvent', 'actorData.login'], ['desc', 'desc', 'asc']);
	let actorList = _.map(streakInfoOrdered, (actorStreak) => actorStreak.actorData);

	res.status(200).send(actorList);
};

const loadStreakData = (events) => {
	const actorsStreak = {};

	events.forEach((event) => {
		let actorId = event.actor_id;
		let createdAt = event.created_at;

		let actorStreak = actorsStreak[actorId];

		if (!actorStreak) {
			actorStreak = {
				currentStreak: 0,
				maxStreak: 0,
				dateLastEvent: createdAt,
				dateLatestEvent: moment(createdAt).valueOf(),
				actorData: event.actor
			};
		}

		const dateLastEvent = moment(actorStreak.dateLastEvent, 'YYYY-MM-DD');
		const dateCurrentEvent = moment(createdAt, 'YYYY-MM-DD');
		const differenceInDays = dateLastEvent.diff(dateCurrentEvent, 'days');

		if (differenceInDays > 1) {
			actorStreak.currentStreak = 0;
		} else if (differenceInDays === 1) {
			actorStreak.currentStreak++;

			if (actorStreak.currentStreak > actorStreak.maxStreak) {
				actorStreak.maxStreak = actorStreak.currentStreak;
			}
		}

		actorStreak.dateLastEvent = createdAt;
		actorsStreak[actorId] = actorStreak;
	});

	return actorsStreak;
};

module.exports = {
	updateActor: asyncErrorHandler(updateActor),
	getAllActors: asyncErrorHandler(getAllActors),
	getStreak: asyncErrorHandler(getStreak)
};
