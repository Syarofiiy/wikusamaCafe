"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaksi.hasMany(models.detail_transaksi, {
        foreignKey: "id_transaksi",
      });
      transaksi.belongsTo(models.user, { foreignKey: "id_user" });
      transaksi.belongsTo(models.meja, { foreignKey: "id_meja" });
    }
  }
  transaksi.init(
    {
      id_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tgl_transaksi: {
        type: DataTypes.DATE,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id_user",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      id_meja: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "meja",
          key: "id_meja",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      nama_pelanggan: DataTypes.STRING,
      status: DataTypes.ENUM("belum_bayar", "lunas"),
    },
    {
      sequelize,
      modelName: "transaksi",
      tableName: "transaksi",
      timestamps: false,
    }
  );
  return transaksi;
};
