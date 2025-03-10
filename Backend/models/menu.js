"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      menu.hasMany(models.detail_transaksi, { foreignKey: "id_menu" });
    }
  }
  menu.init(
    {
      id_menu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nama_menu: DataTypes.STRING,
      jenis: DataTypes.ENUM("makanan", "minuman"),
      deskripsi: DataTypes.TEXT,
      gambar: DataTypes.STRING,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "menu",
      tableName: "menu",
    }
  );
  return menu;
};
