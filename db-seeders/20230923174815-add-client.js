'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Clients', [
      {
        strId: 'client1',
        name: 'Лев Трифонов',
        phone: '+79120333533',
        email: 'levtrifonov@mail.ru',
        status: 'VIP',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
