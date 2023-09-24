'use strict';
const Sequelize = require('sequelize');


module.exports = {
  async up ({ context: queryInterface }) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      strId: {
        allowNull: false,
        type: Sequelize.STRING
      },

      hotelRoomStrId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientStrId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
      },
      checkInAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      checkOutAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },

  async down ({ context: queryInterface }) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
