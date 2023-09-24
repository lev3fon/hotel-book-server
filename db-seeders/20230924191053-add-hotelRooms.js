'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('HotelRooms', [
        {
          strId: 'hotelRoom1',
          name: 'Комната 1(тестовая)',
          description: 'Какая-то комната в каком-то отеле',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          strId: 'hotelRoom2',
          name: 'Комната 2(тестовая)',
          description: 'Какая-то комната в каком-то отеле',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
