const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Question = sequelize.define(
  "Question",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options go here
    timestamps: true,
  }
);

module.exports = { Question };
