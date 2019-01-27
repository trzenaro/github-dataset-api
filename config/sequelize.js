const Sequelize = require('sequelize');
const sequelize = new Sequelize('github-dataset-db', null, null, {
    dialect: 'sqlite',
    storage: './db/github-dataset-db',
    logging: false,
    operatorsAliases: false
});

const init = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    sequelize,
    init
};
