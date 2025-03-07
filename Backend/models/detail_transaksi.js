"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      detail_transaksi.belongsTo(models.transaksi, {
        foreignKey: "id_transaksi",
      });
      detail_transaksi.belongsTo(models.menu, { foreignKey: "id_menu" });
    }
  }
  detail_transaksi.init(
    {
      id_detail_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_transaksi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "transaksi",
          key: "id_transaksi",
        },
      },
      id_menu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "menu",
          key: "id_menu",
        },
      },
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "detail_transaksi",
      tableName: "detail_transaksi",
    }
  );
  return detail_transaksi;
};
