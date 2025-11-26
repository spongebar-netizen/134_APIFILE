'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Perintah untuk membuat tabel 'komiks'
    await queryInterface.createTable('komiks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      judul: {
        type: Sequelize.STRING,
        allowNull: false
      },
      penulis: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false
      }
      // Kita tidak menambahkan createdAt dan updatedAt di sini
      // karena di model kamu, kamu mengatur 'timestamps: false'
    });
  },

  async down(queryInterface, Sequelize) {
    // Perintah untuk membatalkan migrasi (menghapus tabel)
    await queryInterface.dropTable('komiks');
  }
};