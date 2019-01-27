const asyncErrorHandler = require('./utils/asyncErrorHandler');
const Event = require('../models/event');
const Actor = require('../models/actor');
const Repo = require('../models/repo');

const getAllEvents = async (req, res, next) => {
	let events = await Event.findAll({
		attributes: {
			exclude: ['actor_id', 'repo_id']
		},
		include: [
			{ model: Actor, attributes: ['id', 'login', 'avatar_url'] },
			{ model: Repo, attributes: ['id', 'name', 'url'] }
		],
		order: [['id']]
	});

	res.status(200).send(events);
};

const addEvent = async (req, res, next) => {
	const event = req.body;
	const { id, actor, repo } = event;

	let eventStored = await Event.findByPk(id);
	if (eventStored) return res.status(400).send();

	let actorStored = await Actor.findByPk(actor.id);
	if (!actorStored) await Actor.create(actor);

	let repoStored = await Repo.findByPk(repo.id);
	if (!repoStored) await Repo.create(repo);

	await createEvent(event);

	res.status(201).send();
};

const getByActor = async (req, res, next) => {
	const actorId = req.params.id;

	let actorStored = await Actor.findByPk(actorId);
	if (!actorStored) return res.status(404).send();

	const events = await Event.findAll({
		attributes: {
			exclude: ['actor_id', 'repo_id']
		},
		include: [
			{ model: Actor, cattributes: ['id', 'login', 'avatar_url'] },
			{ model: Repo, attributes: ['id', 'name', 'url'] }
		],
		where: { 'actor_id': actorId },
		order: [['id']]
	});

	res.status(200).send(events);
};

const eraseEvents = async (req, res, next) => {
	await Promise.all([
		Event.destroy({ truncate: true }),
		Actor.destroy({ truncate: true }),
		Repo.destroy({ truncate: true })
	]);

	res.status(200).send();
};

const createEvent = async (event) => {
	await Event.create({
		id: event.id,
		type: event.type,
		created_at: event.created_at,
		actor_id: event.actor.id,
		repo_id: event.repo.id
	});
};

module.exports = {
	getAllEvents: asyncErrorHandler(getAllEvents),
	addEvent: asyncErrorHandler(addEvent),
	getByActor: asyncErrorHandler(getByActor),
	eraseEvents: asyncErrorHandler(eraseEvents)
};
