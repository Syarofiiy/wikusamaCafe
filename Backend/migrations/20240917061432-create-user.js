"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      nama_user: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM("admin", "kasir", "manager"),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
