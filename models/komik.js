'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Komik extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // RELASI: Komik itu MILIK satu User (Belongs To)
      Komik.belongsTo(models.User, {
        foreignKey: 'userId', // Nyambung ke User lewat kolom ini
        as: 'pemilik'         // Nanti pas dipanggil namanya 'pemilik'
      });
    }
  }
  Komik.init({
    judul: DataTypes.STRING,
    penulis: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    
    // INI KOLOM PENTING (Foreign Key)
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Komik gaboleh yatim piatu (harus ada user yg bikin)
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Komik',
    tableName: 'komik' // Pastikan nama tabelnya 'komik' (huruf kecil)
  });
  return Komik;
};