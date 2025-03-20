"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Posts", "content", {
      type: Sequelize.STRING(3000),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {},
};
