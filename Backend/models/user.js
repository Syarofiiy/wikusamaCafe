"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.transaksi, { foreignKey: "id_user" });
    }
  }
  user.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_user: DataTypes.STRING,
      role: DataTypes.ENUM("admin", "kasir", "manager"),
      username: DataTypes.STRING,
      password: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
