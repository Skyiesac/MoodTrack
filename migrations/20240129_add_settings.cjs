'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'settings', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: JSON.stringify({
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          reminders: true
        },
        privacy: {
          publicProfile: false,
          shareJournals: false
        }
      })
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'settings');
  }
};
